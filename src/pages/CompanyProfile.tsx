import { FormEvent, useState } from 'react'
import { Building, Award, Heart, Target, Eye, Shield, FileCheck, Plus, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoWall } from '@/components/LogoWall'
import { Testimonial } from '@/components/Testimonial'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { useAuth } from '@/contexts/AuthContext'
import { useContentValue } from '@/hooks/useSiteContent'
import { ImageCardSlider } from '@/components/ImageCardSlider'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ManagedCardItem {
  id: string
  title: string
  description: string
}

interface ManagedCardSectionProps {
  prefix: string
  title: string
  description: string
  cards: ManagedCardItem[]
  descriptionField: string
  addLabel: string
}

function ManagedCard({
  card,
  prefix,
  descriptionField,
  onDelete,
}: {
  card: ManagedCardItem
  prefix: string
  descriptionField: string
  onDelete: (id: string) => void
}) {
  const { isAdmin } = useAuth()
  const image = useContentValue(`${prefix}.${card.id}.image`, '')

  return (
    <div className="relative flex h-full flex-col items-center justify-center rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-red-200 hover:text-red-600"
          aria-label={`Delete ${card.title}`}
          title="Delete card"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
        {image ? (
          <img src={image} alt={card.title} className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-xs font-medium text-slate-500">No image</span>
        )}
      </div>

      <EditText
        contentKey={`${prefix}.${card.id}.title`}
        fallback={card.title}
        render={(value) => <h3 className="text-xl font-bold text-gray-800">{value}</h3>}
      />
      <EditText
        contentKey={`${prefix}.${card.id}.${descriptionField}`}
        fallback={card.description}
        multiline
        render={(value) => <p className="mt-2 text-gray-600">{value}</p>}
      />

      <UploadImage
        contentKey={`${prefix}.${card.id}.image`}
        label="Upload image"
        className="mt-4 justify-center"
      />
    </div>
  )
}

function ManagedCardSection({ prefix, title, description, cards: initialCards, descriptionField, addLabel }: ManagedCardSectionProps) {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [cards, setCards] = useState(initialCards)
  const [isOpen, setIsOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    const id = `card-${Date.now()}`
    const card = { id, title: newTitle.trim(), description: newDescription.trim() }

    try {
      const rows = [
        { key: `${prefix}.${id}.title`, value: card.title, type: 'text' },
        { key: `${prefix}.${id}.${descriptionField}`, value: card.description, type: 'text' },
      ]
      const { error: saveError } = await supabase.from('site_content').upsert(
        rows.map((row) => ({ ...row, updated_at: new Date().toISOString() })),
        { onConflict: 'key' },
      )

      if (saveError) throw saveError

      setCards((currentCards) => [...currentCards, card])
      setNewTitle('')
      setNewDescription('')
      setIsOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['site-content'] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this card?')) return

    const keys = [
      `${prefix}.${id}.title`,
      `${prefix}.${id}.${descriptionField}`,
      `${prefix}.${id}.image`,
    ]
    const { error: deleteError } = await supabase.from('site_content').delete().in('key', keys)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setCards((currentCards) => currentCards.filter((card) => card.id !== id))
    await queryClient.invalidateQueries({ queryKey: ['site-content'] })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" />{addLabel}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{addLabel}</DialogTitle>
                  <DialogDescription>Add the card text, then upload its image from the card.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="grid gap-4">
                  <div>
                    <Label htmlFor={`${prefix}-new-title`}>Title</Label>
                    <Input id={`${prefix}-new-title`} value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor={`${prefix}-new-description`}>Description</Label>
                    <Input id={`${prefix}-new-description`} value={newDescription} onChange={(event) => setNewDescription(event.target.value)} required />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isSaving}>{isSaving ? 'Adding...' : 'Add card'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => <ManagedCard key={card.id} card={card} prefix={prefix} descriptionField={descriptionField} onDelete={handleDelete} />)}
        </div>
        {error && !isOpen && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
      </div>
    </section>
  )
}

function CompanyProfileGallery() {
  return (
    <ImageCardSlider
      titleKey="companyprofile.gallery.title"
      fallbackTitle="Community Highlights"
      imageKeys={[
        'companyprofile.gallery.image1',
        'companyprofile.gallery.image2',
        'companyprofile.gallery.image3',
        'companyprofile.gallery.image4',
      ]}
      className="bg-gray-50"
    />
  )
}

/**
 * Company Profile page component
 * Matches the PDF design with orange/grey color scheme and Century Gothic typography
 */
export function CompanyProfile() {
  const logoSrc = useContentValue('site.logo', '/RDL Logo Full Color.png')
  const certifications = [
    {
      id: 'pacra',
      icon: Building,
      title: 'PACRA Certificate',
      subtitle: 'Company Registration',
      status: 'Active',
      valid: 'Registered 2013 • Incorporated 15 Dec 2021',
      description: 'Private Company Limited by Shares',
    },
    {
      id: 'zra',
      icon: FileCheck,
      title: 'ZRA Tax Clearance',
      subtitle: 'Tax Compliance',
      status: 'Valid',
      valid: 'Valid through 31 Dec 2025',
      description: 'Current tax clearance certificate in good standing',
    },
    {
      id: 'napsa',
      icon: Shield,
      title: 'NAPSA Compliance',
      subtitle: 'Social Security',
      status: 'Valid',
      valid: 'Valid through 18 Jun 2025',
      description: 'Employee contributions fully up to date',
    },
    {
      id: 'zppa',
      icon: Award,
      title: 'ZPPA Supplier Registration',
      subtitle: 'Procurement',
      status: 'Active',
      valid: 'Valid through 18 Mar 2026',
      description: 'Approved supplier for Printing, Media & ICT categories',
    },
  ]

  const testimonials = [
    {
      id: 'testimonial1',
      quote:
        'Rubexy Designs delivered exceptional quality on our fleet branding project. The attention to detail and professional service exceeded our expectations.',
      quoteKey: 'companyprofile.testimonials.1.quote',
      author: 'John Mwape',
      authorKey: 'companyprofile.testimonials.1.author',
      role: 'Operations Manager',
      roleKey: 'companyprofile.testimonials.1.role',
      company: 'Logistics Company',
      companyKey: 'companyprofile.testimonials.1.company',
    },
    {
      id: 'testimonial2',
      quote:
        'The team handled our annual report with utmost professionalism. From design to print, everything was flawless. We trust Rubexy for our corporate publishing needs.',
      quoteKey: 'companyprofile.testimonials.2.quote',
      author: 'Sarah Phiri',
      authorKey: 'companyprofile.testimonials.2.author',
      role: 'Marketing Director',
      roleKey: 'companyprofile.testimonials.2.role',
      company: 'Financial Services',
      companyKey: 'companyprofile.testimonials.2.company',
    },
    {
      id: 'testimonial3',
      quote:
        'Excellent photography and documentary production services. They captured our cancer awareness campaign beautifully and professionally.',
      quoteKey: 'companyprofile.testimonials.3.quote',
      author: 'Dr. Grace Banda',
      authorKey: 'companyprofile.testimonials.3.author',
      role: 'Executive Director',
      roleKey: 'companyprofile.testimonials.3.role',
      company: 'Breakthrough Cancer Trust',
      companyKey: 'companyprofile.testimonials.3.company',
    },
  ]

  return (
    <>
      <SEO
        title="Company Profile | Rubexy Designs Limited"
        description="Official company profile of Rubexy Designs Limited - established 2012, incorporated 2021. Providing quality brand, print, and media solutions with creativity unlimited."
        keywords="rubexy designs company profile, zambian design company, printing services lusaka, corporate profile"
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section - Matching PDF Cover */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* Top Orange Line */}
              <div className="w-full h-1 bg-orange-500 mb-8"></div>
              
              {/* Main Title */}
              <div className="mb-8">
                <EditText
                  contentKey="companyprofile.hero.title"
                  fallback="OUR COMPANY PROFILE"
                  render={(value) => (
                    <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wider">{value}</h1>
                  )}
                />
              </div>

              {/* Company Logo Area */}
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto overflow-hidden rounded-full border-4 border-gray-300 bg-white shadow-lg">
                  <img 
                    src={logoSrc} 
                    alt="RDL Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <UploadImage contentKey="site.logo" label="Logo" className="block mx-auto mt-4" />
              </div>

              {/* Services */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-center gap-4 text-white">
                  <EditText
                    contentKey="companyprofile.hero.services.print"
                    fallback="PRINT"
                    render={(value) => (
                      <span className="text-lg font-bold tracking-wider">{value}</span>
                    )}
                  />
                  <div className="w-1 h-6 bg-orange-500"></div>
                  <EditText
                    contentKey="companyprofile.hero.services.brand"
                    fallback="BRAND"
                    render={(value) => (
                      <span className="text-lg font-bold tracking-wider">{value}</span>
                    )}
                  />
                  <div className="w-1 h-6 bg-orange-500"></div>
                  <EditText
                    contentKey="companyprofile.hero.services.media"
                    fallback="MEDIA"
                    render={(value) => (
                      <span className="text-lg font-bold tracking-wider">{value}</span>
                    )}
                  />
                </div>
                <div className="mt-4 relative z-20">
                  <EditText
                    contentKey="companyprofile.hero.tagline"
                    fallback="Creativity Unlimited"
                    render={(value) => (
                      <span className="text-white text-xl italic font-light block">{value}</span>
                    )}
                  />
                </div>
              </div>

              {/* Bottom Curved Elements */}
              <div className="relative">
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-white to-orange-500 transform -skew-y-1"></div>
                <div className="absolute bottom-0 left-0 w-full h-12 bg-orange-500 transform -skew-y-2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-white relative" id="mission">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 max-w-6xl mx-auto">
              {/* Mission */}
              <div className="relative">
                <div className="bg-gray-100 rounded-2xl p-8 border-l-4 border-orange-500">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500 text-white p-3 rounded-lg">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <EditText
                        contentKey="companyprofile.mission.title"
                        fallback="Our Mission"
                        render={(value) => (
                          <h2 className="text-2xl font-bold text-gray-800 mb-4">{value}</h2>
                        )}
                      />
                      <EditText
                        contentKey="companyprofile.mission.content"
                        fallback="To maintain long-term business relations with our existing and prospective clients by providing quality products and services in a professional manner."
                        render={(value) => (
                          <p className="text-gray-700 leading-relaxed">{value}</p>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="relative">
                <div className="bg-orange-50 rounded-2xl p-8 border-l-4 border-orange-500">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500 text-white p-3 rounded-lg">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div>
                      <EditText
                        contentKey="companyprofile.vision.title"
                        fallback="Our Vision"
                        render={(value) => (
                          <h2 className="text-2xl font-bold text-gray-800 mb-4">{value}</h2>
                        )}
                      />
                      <EditText
                        contentKey="companyprofile.vision.content"
                        fallback="To create an enabling environment to our clients by providing solution-based products and services in an innovative, professional and efficient manner."
                        render={(value) => (
                          <p className="text-gray-700 leading-relaxed">{value}</p>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Information Section */}
        <section className="py-16 bg-gray-50" id="story">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <EditText
                  contentKey="companyprofile.about.title"
                  fallback="About Rubexy Designs Limited"
                  render={(value) => (
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{value}</h2>
                  )}
                />
                
                <div className="prose prose-lg max-w-none text-gray-700">
                  <EditText
                    contentKey="companyprofile.about.paragraph1"
                    fallback="Rubexy Designs Limited (RDL) was established in 2012 as a PACRA business name (registered 2013) and incorporated as a Private Company Limited by Shares on December 15, 2021. From our humble beginnings, we have grown into one of Zambia's trusted providers of comprehensive brand, print, and media solutions."
                    render={(value) => (
                      <p className="mb-6">{value}</p>
                    )}
                  />
                  
                  <EditText
                    contentKey="companyprofile.about.paragraph2"
                    fallback="Based in FINDECO House, Floor 12, Lusaka, we serve clients across Zambia and beyond. Our commitment to quality, professionalism, and efficiency has earned us the trust of leading organizations, government entities, and private businesses."
                    render={(value) => (
                      <p className="mb-6">{value}</p>
                    )}
                  />

                  <div className="bg-orange-50 rounded-lg p-6 mb-6">
                    <EditText
                      contentKey="companyprofile.about.services.heading"
                      fallback="Our Services"
                      render={(value) => (
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{value}</h3>
                      )}
                    />
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <EditText
                          contentKey="companyprofile.about.services.print.title"
                          fallback="Print"
                          render={(value) => (
                            <h4 className="font-semibold text-orange-600 mb-2">{value}</h4>
                          )}
                        />
                        <ul className="text-sm space-y-1">
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.print.item1"
                              fallback="• Books, magazines, posters, flyers"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.print.item2"
                              fallback="• Certificates, business cards, letterheads"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.print.item3"
                              fallback="• Billboards, light boxes, pop-up banners"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.print.item4"
                              fallback="• Annual reports, catalogues, and brochures"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.print.item5"
                              fallback="• Letterheads, invoices, quotations, and forms"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.print.item6"
                              fallback="• Technical documentation and corporate publishing"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                        </ul>
                      </div>
                      <div>
                        <EditText
                          contentKey="companyprofile.about.services.brand.title"
                          fallback="Brand"
                          render={(value) => (
                            <h4 className="font-semibold text-orange-600 mb-2">{value}</h4>
                          )}
                        />
                        <ul className="text-sm space-y-1">
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.brand.item1"
                              fallback="• Corporate wear supply & branding"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.brand.item2"
                              fallback="• Vehicle branding & signage"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.brand.item3"
                              fallback="• Office branding & embroidery"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.brand.item4"
                              fallback="• Signage and interior branding"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.brand.item5"
                              fallback="• Logo and identity design"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.brand.item6"
                              fallback="• Branded merchandise and packaging"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                        </ul>
                      </div>
                      <div>
                        <EditText
                          contentKey="companyprofile.about.services.media.title"
                          fallback="Media"
                          render={(value) => (
                            <h4 className="font-semibold text-orange-600 mb-2">{value}</h4>
                          )}
                        />
                        <ul className="text-sm space-y-1">
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.media.item1"
                              fallback="• Professional photography"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.media.item2"
                              fallback="• Documentary production"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.media.item3"
                              fallback="• Video advertisements"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.media.item4"
                              fallback="• Corporate videography"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.media.item5"
                              fallback="• Event coverage"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                          <li>
                            <EditText
                              contentKey="companyprofile.about.services.media.item6"
                              fallback="• Product photography"
                              render={(value) => <span>{value}</span>}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <EditText
                    contentKey="companyprofile.about.paragraph3"
                    fallback="We are fully compliant with Zambian regulations, holding current certifications from PACRA, ZRA (Tax Clearance valid through December 2025), NAPSA (valid through June 2025), and ZPPA supplier registration (valid through March 2026)."
                    render={(value) => (
                      <p className="mb-6">{value}</p>
                    )}
                  />

                  <div className="text-center">
                    <EditText
                      contentKey="companyprofile.about.closing"
                      fallback="We look forward to doing business with you."
                      render={(value) => (
                        <p className="text-orange-600 font-bold text-lg">{value}</p>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CompanyProfileGallery />

        {/* CSR Section */}
        <section className="py-16 bg-white" id="csr">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="h-8 w-8 text-orange-500" />
                    <EditText
                      contentKey="companyprofile.csr.title"
                      fallback="Corporate Social Responsibility"
                      render={(value) => (
                        <CardTitle className="text-2xl text-gray-800">{value}</CardTitle>
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <EditText
                    contentKey="companyprofile.csr.paragraph1"
                    fallback="At Rubexy Designs, we believe in giving back to the community. We are proud to serve as a media partner for Breakthrough Cancer Trust, providing media services for cancer-awareness initiatives."
                    render={(value) => (
                      <p className="text-gray-700 leading-relaxed mb-4">{value}</p>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.csr.paragraph2"
                    fallback="Through our partnership, we use our expertise in photography, videography, and multimedia production to help raise awareness about cancer prevention, early detection, and support for those affected. This is our way of using creativity for a meaningful cause."
                    render={(value) => (
                      <p className="text-gray-700 leading-relaxed">{value}</p>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <ManagedCardSection
          prefix="companyprofile.values"
          title="Why Choose Rubexy Designs Limited?"
          description="The values that guide our work and client relationships"
          descriptionField="content"
          addLabel="Add value card"
          cards={[
            { id: 'card1', title: 'Friendly Support Staff', description: 'Our team is approachable and always ready to help with your project needs.' },
            { id: 'card2', title: 'Highly Efficient', description: 'We deliver projects on time and within budget, every time.' },
            { id: 'card3', title: 'Client Oriented', description: 'Your success is our priority. We tailor solutions to your specific needs.' },
            { id: 'card4', title: 'Very Professional', description: 'We maintain the highest standards of professionalism in all our work.' },
            { id: 'card5', title: 'Great & Impeccable', description: 'We strive for perfection in every project we undertake.' },
            { id: 'card6', title: 'Creativity Unlimited', description: 'Our motto drives us to push creative boundaries and deliver innovative solutions.' },
          ]}
        />

        <div id="compliance">
          <ManagedCardSection
            prefix="companyprofile.compliance"
            title="Compliance & Certifications"
            description="Fully registered and compliant with all Zambian regulatory requirements"
            descriptionField="subtitle"
            addLabel="Add certification card"
            cards={certifications.map(({ id, title, subtitle }) => ({ id, title, description: subtitle }))}
          />
        </div>

        {/* Clients & Testimonials */}
        <section className="py-16 bg-gray-50" id="clients">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <EditText
                contentKey="companyprofile.clients.title"
                fallback="Clients & Partnerships"
                render={(value) => (
                  <h2 className="text-3xl font-bold text-gray-800 font-brand">{value}</h2>
                )}
              />
              <EditText
                contentKey="companyprofile.clients.subtitle"
                fallback="Trusted by leading organizations across Zambia and the region"
                render={(value) => (
                  <p className="text-gray-600 mt-2 font-brand">{value}</p>
                )}
              />
            </div>

            <LogoWall />

            <div className="mt-16 text-center max-w-3xl mx-auto">
              <EditText
                contentKey="companyprofile.clients.projectTitle"
                fallback="Project Highlights"
                render={(value) => (
                  <h3 className="text-2xl font-semibold text-gray-800 font-brand mb-4">{value}</h3>
                )}
              />
              <EditText
                contentKey="companyprofile.clients.projectCopy"
                fallback="We have successfully delivered fleet branding for DHL Express and continue to support Breakthrough Cancer Trust with media services for cancer awareness initiatives."
                render={(value) => (
                  <p className="text-gray-600 font-brand">{value}</p>
                )}
              />
            </div>

            <div className="mt-12">
              <EditText
                contentKey="companyprofile.clients.testimonials.title"
                fallback="What Our Clients Say"
                render={(value) => (
                  <h3 className="text-2xl font-semibold text-gray-800 font-brand text-center mb-8">{value}</h3>
                )}
              />
              <div className="grid gap-6 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <Testimonial key={testimonial.id} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}


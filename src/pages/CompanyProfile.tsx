import { useState } from 'react'
import { Building, Users, Award, Heart, Target, Eye, Shield, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoWall } from '@/components/LogoWall'
import { Testimonial } from '@/components/Testimonial'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { useAuth } from '@/contexts/AuthContext'
import { useContentValue } from '@/hooks/useSiteContent'

function CompanyProfileGallery() {
  const { isAdmin } = useAuth()
  const [activeIndex, setActiveIndex] = useState(0)

  const image1 = useContentValue('companyprofile.gallery.image1', '')
  const image2 = useContentValue('companyprofile.gallery.image2', '')
  const image3 = useContentValue('companyprofile.gallery.image3', '')
  const image4 = useContentValue('companyprofile.gallery.image4', '')

  const validImages = [image1, image2, image3, image4].filter(Boolean)

  const goToPrevious = () => {
    if (validImages.length <= 1) return
    setActiveIndex((current) => (current === 0 ? validImages.length - 1 : current - 1))
  }

  const goToNext = () => {
    if (validImages.length <= 1) return
    setActiveIndex((current) => (current === validImages.length - 1 ? 0 : current + 1))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <Card className="overflow-hidden border-2 border-orange-200 bg-white">
            <CardHeader className="pb-4">
              <EditText
                contentKey="companyprofile.gallery.title"
                fallback="Community Highlights"
                render={(value) => (
                  <CardTitle className="text-2xl text-gray-800">{value}</CardTitle>
                )}
              />
            </CardHeader>

            <CardContent className="pb-6">
              {validImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white">
                    <img
                      src={validImages[activeIndex]}
                      alt="Company profile gallery"
                      className="h-[480px] w-full object-cover object-center"
                      style={{ aspectRatio: '3 / 4' }}
                    />

                    {validImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          onClick={goToPrevious}
                          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          onClick={goToNext}
                          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {validImages.length > 1 && (
                    <div className="flex justify-center gap-2">
                      {validImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Go to slide ${index + 1}`}
                          onClick={() => setActiveIndex(index)}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            index === activeIndex ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
                  No gallery images uploaded yet.
                </div>
              )}

              {isAdmin && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {[
                    'companyprofile.gallery.image1',
                    'companyprofile.gallery.image2',
                    'companyprofile.gallery.image3',
                    'companyprofile.gallery.image4',
                  ].map((key, index) => (
                    <UploadImage
                      key={key}
                      contentKey={key}
                      label={`Upload image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
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

        {/* Values Section */}
        <section className="py-16 bg-gray-50" id="values">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <EditText
                contentKey="companyprofile.values.title"
                fallback="Why Choose Rubexy Designs Limited?"
                render={(value) => (
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{value}</h2>
                )}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <EditText
                    contentKey="companyprofile.values.card1.title"
                    fallback="Friendly Support Staff"
                    render={(value) => (
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{value}</h3>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.values.card1.content"
                    fallback="Our team is approachable and always ready to help with your project needs."
                    render={(value) => <p className="text-gray-600">{value}</p>}
                  />
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <EditText
                    contentKey="companyprofile.values.card2.title"
                    fallback="Highly Efficient"
                    render={(value) => (
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{value}</h3>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.values.card2.content"
                    fallback="We deliver projects on time and within budget, every time."
                    render={(value) => <p className="text-gray-600">{value}</p>}
                  />
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <EditText
                    contentKey="companyprofile.values.card3.title"
                    fallback="Client Oriented"
                    render={(value) => (
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{value}</h3>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.values.card3.content"
                    fallback="Your success is our priority. We tailor solutions to your specific needs."
                    render={(value) => <p className="text-gray-600">{value}</p>}
                  />
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <EditText
                    contentKey="companyprofile.values.card4.title"
                    fallback="Very Professional"
                    render={(value) => (
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{value}</h3>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.values.card4.content"
                    fallback="We maintain the highest standards of professionalism in all our work."
                    render={(value) => <p className="text-gray-600">{value}</p>}
                  />
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <EditText
                    contentKey="companyprofile.values.card5.title"
                    fallback="Great & Impeccable"
                    render={(value) => (
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{value}</h3>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.values.card5.content"
                    fallback="We strive for perfection in every project we undertake."
                    render={(value) => <p className="text-gray-600">{value}</p>}
                  />
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <EditText
                    contentKey="companyprofile.values.card6.title"
                    fallback="Creativity Unlimited"
                    render={(value) => (
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{value}</h3>
                    )}
                  />
                  <EditText
                    contentKey="companyprofile.values.card6.content"
                    fallback="Our motto drives us to push creative boundaries and deliver innovative solutions."
                    render={(value) => <p className="text-gray-600">{value}</p>}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Compliance & Certifications */}
        <section className="py-16 bg-white" id="compliance">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <EditText
                contentKey="companyprofile.compliance.title"
                fallback="Compliance & Certifications"
                render={(value) => (
                  <h2 className="text-3xl font-bold text-gray-800 font-brand">{value}</h2>
                )}
              />
              <EditText
                contentKey="companyprofile.compliance.description"
                fallback="Fully registered and compliant with all Zambian regulatory requirements"
                render={(value) => (
                  <p className="text-gray-600 mt-2 font-brand">{value}</p>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert) => {
                const Icon = cert.icon
                return (
                  <Card key={cert.id} className="border-2 border-orange-200 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-brand">
                            <EditText
                              contentKey={`companyprofile.compliance.${cert.id}.title`}
                              fallback={cert.title}
                              render={(value) => <>{value}</>}
                            />
                          </CardTitle>
                          <p className="text-sm text-gray-500 font-brand">
                            <EditText
                              contentKey={`companyprofile.compliance.${cert.id}.subtitle`}
                              fallback={cert.subtitle}
                              render={(value) => <>{value}</>}
                            />
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            <div className="mt-12 max-w-3xl mx-auto text-center">
              <EditText
                contentKey="companyprofile.compliance.footer"
                fallback="Copies of certificates can be provided to authorized parties upon request. We maintain privacy and security while remaining transparent with partners and clients."
                render={(value) => (
                  <p className="text-sm text-gray-500 font-brand">{value}</p>
                )}
              />
            </div>
          </div>
        </section>

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


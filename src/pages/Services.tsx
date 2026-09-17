import { 
  Printer, 
  Palette, 
  Shirt, 
  Car, 
  Camera, 
  Video,
  FileText,
  Award 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ServiceCard } from '@/components/ServiceCard'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { useContentValue } from '@/hooks/useSiteContent'

/**
 * Services page component
 * Displays printing, branding, and media services
 */
export function Services() {
  const logoSrc = useContentValue('site.logo', '/RDL Logo Full Color.png')
  const printServices = [
    {
      icon: Printer,
      title: 'Printing Services',
      description: 'Professional printing for all your business needs',
      contentKey: 'services.print.card.printing',
      items: [
        'Books and magazines',
        'Posters and flyers',
        'Certificates and awards',
        'Business cards',
        'Letterheads and invoices',
        'Quotations and forms',
      ],
      itemKeys: [
        'services.print.card.printing.item1',
        'services.print.card.printing.item2',
        'services.print.card.printing.item3',
        'services.print.card.printing.item4',
        'services.print.card.printing.item5',
        'services.print.card.printing.item6',
      ],
    },
    {
      icon: FileText,
      title: 'Publications & Reports',
      description: 'Premium publishing for corporate and marketing materials',
      contentKey: 'services.print.card.publications',
      items: [
        'Annual reports & brochures',
        'Corporate profiles',
        'Training manuals & guides',
        'Proposal and tender documents',
        'Catalogues and menu books',
        'Technical documentation',
      ],
      itemKeys: [
        'services.print.card.publications.item1',
        'services.print.card.publications.item2',
        'services.print.card.publications.item3',
        'services.print.card.publications.item4',
        'services.print.card.publications.item5',
        'services.print.card.publications.item6',
      ],
    },
    {
      icon: Award,
      title: 'Large Format Printing',
      description: 'High-impact displays for indoor and outdoor visibility',
      contentKey: 'services.print.card.largeFormat',
      items: [
        'Billboards and light boxes',
        'Pop-up and roll-up banners',
        'Trade show graphics',
        'Event backdrops',
        'Window & floor graphics',
        'Wayfinding signage',
      ],
      itemKeys: [
        'services.print.card.largeFormat.item1',
        'services.print.card.largeFormat.item2',
        'services.print.card.largeFormat.item3',
        'services.print.card.largeFormat.item4',
        'services.print.card.largeFormat.item5',
        'services.print.card.largeFormat.item6',
      ],
    },
  ]

  const brandingServices = [
    {
      icon: Shirt,
      title: 'Corporate Wear',
      description: 'Professional uniforms and branded apparel',
      contentKey: 'services.branding.card.corporateWear',
      items: [
        'T-shirt printing',
        'Corporate wear supply',
        'Embroidery services',
        'Uniform design',
        'Branded merchandise',
        'Custom apparel',
      ],
      itemKeys: [
        'services.branding.card.corporateWear.item1',
        'services.branding.card.corporateWear.item2',
        'services.branding.card.corporateWear.item3',
        'services.branding.card.corporateWear.item4',
        'services.branding.card.corporateWear.item5',
        'services.branding.card.corporateWear.item6',
      ],
    },
    {
      icon: Car,
      title: 'Vehicle Branding',
      description: 'Turn your fleet into mobile advertisements',
      contentKey: 'services.branding.card.vehicleBranding',
      items: [
        'Full vehicle wraps',
        'Partial vehicle graphics',
        'Fleet branding',
        'Magnetic signs',
        'Window decals',
        'Design and installation',
      ],
      itemKeys: [
        'services.branding.card.vehicleBranding.item1',
        'services.branding.card.vehicleBranding.item2',
        'services.branding.card.vehicleBranding.item3',
        'services.branding.card.vehicleBranding.item4',
        'services.branding.card.vehicleBranding.item5',
        'services.branding.card.vehicleBranding.item6',
      ],
    },
  ]

  const mediaServices = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Professional photography for every occasion',
      contentKey: 'services.media.card.photography',
      items: [
        'Corporate headshots',
        'Event photography',
        'Product photography',
        'Architectural photography',
        'Team photos',
        'Marketing photography',
      ],
      itemKeys: [
        'services.media.card.photography.item1',
        'services.media.card.photography.item2',
        'services.media.card.photography.item3',
        'services.media.card.photography.item4',
        'services.media.card.photography.item5',
        'services.media.card.photography.item6',
      ],
    },
    {
      icon: Video,
      title: 'Videography & Documentaries',
      description: 'Tell your story through compelling video',
      contentKey: 'services.media.card.video',
      items: [
        'Documentary production',
        'Video advertisements',
        'Corporate videos',
        'Event coverage',
        'Training videos',
        'Promotional content',
      ],
      itemKeys: [
        'services.media.card.video.item1',
        'services.media.card.video.item2',
        'services.media.card.video.item3',
        'services.media.card.video.item4',
        'services.media.card.video.item5',
        'services.media.card.video.item6',
      ],
    },
  ]

  return (
    <>
      <SEO
        title="Our Services | Rubexy Designs Limited"
        description="Comprehensive brand, print, and media services including printing, branding, corporate wear, vehicle branding, photography, and documentary production in Zambia."
        keywords="printing services zambia, branding services, corporate wear, vehicle wraps, photography lusaka, video production zambia"
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="w-24 h-24 mx-auto mb-6 overflow-hidden rounded-full bg-white shadow-lg">
                <img 
                  src={logoSrc} 
                  alt="RDL Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <UploadImage contentKey="site.logo" label="Logo" className="block mx-auto mb-6" />
              <EditText
                contentKey="services.hero.title"
                fallback="Our Services"
                render={(value) => (
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-brand">
                    {value}
                  </h1>
                )}
              />
              <EditText
                contentKey="services.hero.subtitle"
                fallback="Comprehensive brand, print, and media solutions tailored to your business needs"
                render={(value) => (
                  <p className="text-xl text-gray-600 font-brand">
                    {value}
                  </p>
                )}
              />
            </div>
          </div>
        </section>

        {/* Print Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
                <Printer className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-primary">Print</span>
              </div>
              <EditText
                contentKey="services.print.title"
                fallback="Print Production Excellence"
                render={(value) => (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {value}
                  </h2>
                )}
              />
              <EditText
                contentKey="services.print.description"
                fallback="From short-run digital to long-run offset, we deliver crisp print quality with professional finishing that elevates your business communication."
                render={(value) => (
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {value}
                  </p>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {printServices.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* Branding Services */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
                <Palette className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-primary">Brand</span>
              </div>
              <EditText
                contentKey="services.branding.title"
                fallback="Branding & Identity Solutions"
                render={(value) => (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {value}
                  </h2>
                )}
              />
              <EditText
                contentKey="services.branding.description"
                fallback="Build trust with a cohesive brand touchpoint—from signage and uniforms to vehicle graphics and interior experiences."
                render={(value) => (
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {value}
                  </p>
                )}
              />
            </div>

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {brandingServices.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* Media Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-primary">Media</span>
              </div>
              <EditText
                contentKey="services.media.title"
                fallback="Media Production"
                render={(value) => (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {value}
                  </h2>
                )}
              />
              <EditText
                contentKey="services.media.description"
                fallback="Professional photography and videography services to capture your brand's story and create compelling visual content."
                render={(value) => (
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {value}
                  </p>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {mediaServices.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl border-2 border-primary bg-primary/5 p-8 md:p-12 text-center">
              <EditText
                contentKey="services.cta.title"
                fallback="Need a Custom Solution?"
                render={(value) => (
                  <h2 className="text-3xl font-bold mb-4">
                    {value}
                  </h2>
                )}
              />
              <EditText
                contentKey="services.cta.description"
                fallback="Can't find exactly what you're looking for? We specialize in custom solutions tailored to your specific needs. Let's discuss your project."
                render={(value) => (
                  <p className="text-muted-foreground mb-8">
                    {value}
                  </p>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/rfq">Request a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}


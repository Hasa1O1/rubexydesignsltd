import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { ImageCardSlider } from '@/components/ImageCardSlider'
import { useContentValue } from '@/hooks/useSiteContent'

/**
 * Contact page component
 * Features contact form, office address, map, and contact information
 */
export function Contact() {
  const logoSrc = useContentValue('site.logo', '/RDL Logo Full Color.png')

  return (
    <>
      <SEO
        title="Contact Us | Rubexy Designs Limited"
        description="Get in touch with Rubexy Designs Limited. Located in Lusaka, Zambia. Call us at +260 972 188566 or email rubexydesigns@gmail.com"
        keywords="contact rubexy designs, design company lusaka, zambia printing contact, get a quote"
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
                contentKey="contact.hero.title"
                fallback="Contact Us"
                render={(value) => (
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-brand">{value}</h1>
                )}
              />
              <EditText
                contentKey="contact.hero.subtitle"
                fallback="Let's discuss how we can help bring your vision to life"
                render={(value) => (
                  <p className="text-xl text-gray-600 font-brand">{value}</p>
                )}
              />
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
              {/* Contact form */}
              <div>
                <EditText
                  contentKey="contact.form.title"
                  fallback="Send Us a Message"
                  render={(value) => (
                    <h2 className="text-2xl font-bold mb-6">{value}</h2>
                  )}
                />
                <ContactForm />
              </div>

              {/* Contact information */}
              <div className="space-y-6">
                <div>
                  <EditText
                    contentKey="contact.info.title"
                    fallback="Get in Touch"
                    render={(value) => (
                      <h2 className="text-2xl font-bold mb-6">{value}</h2>
                    )}
                  />
                  <EditText
                    contentKey="contact.info.description"
                    fallback="Have a question or want to discuss a project? We'd love to hear from you. Fill out the form or reach us through any of the contact methods below."
                    render={(value) => (
                      <p className="text-muted-foreground mb-8">{value}</p>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <CardTitle className="text-lg">Office Address</CardTitle>
                          <CardDescription className="mt-2">
                            FINDECO House<br />
                            Floor 12, Room 16/18<br />
                            Lusaka, Zambia
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <CardTitle className="text-lg">Phone</CardTitle>
                          <CardDescription className="mt-2 space-y-1">
                            <div>
                              <a 
                                href="tel:+260972188566" 
                                className="hover:text-primary transition-colors"
                              >
                                +260 972 188566
                              </a>
                            </div>
                            <div>
                              <a 
                                href="tel:+260955530293" 
                                className="hover:text-primary transition-colors"
                              >
                                +260 955 530293
                              </a>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <CardTitle className="text-lg">Email</CardTitle>
                          <CardDescription className="mt-2">
                            <a 
                              href="mailto:rubexydesigns@gmail.com" 
                              className="hover:text-primary transition-colors"
                            >
                              rubexydesigns@gmail.com
                            </a>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <CardTitle className="text-lg">Business Hours</CardTitle>
                          <CardDescription className="mt-2">
                            Monday - Friday: 8:00 AM - 5:00 PM<br />
                            Saturday - Sunday: Closed
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ImageCardSlider
          titleKey="contact.findus.title"
          fallbackTitle="Find Us"
          imageKeys={[
            'contact.findus.image1',
            'contact.findus.image2',
            'contact.findus.image3',
            'contact.findus.image4',
            'contact.findus.image5',
            'contact.findus.image6',
            'contact.findus.image7',
            'contact.findus.image8',
            'contact.findus.image9',
            'contact.findus.image10',
          ]}
          className="bg-muted/30"
        />
      </main>
    </>
  )
}


import { Award, Target, Eye, Heart } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { ImageCardSlider } from '@/components/ImageCardSlider'
import { useContentValue } from '@/hooks/useSiteContent'

function AboutImageSlider() {
  return (
    <ImageCardSlider
      titleKey="about.csr.title"
      fallbackTitle="Community & Impact"
      imageKeys={['about.gallery.image1', 'about.gallery.image2', 'about.gallery.image3', 'about.gallery.image4']}
      className="bg-muted/30"
    />
  )
}

/**
 * About page component
 * Information about company background, vision, mission, and CSR
 */
export function About() {
  const logoSrc = useContentValue('site.logo', '/RDL Logo Full Color.png')

  return (
    <>
      <SEO
        title="About Us | Rubexy Designs Limited"
        description="Learn about Rubexy Designs Limited - founded in 2012, incorporated in 2021. Providing quality brand, print, and media solutions with a commitment to excellence."
        keywords="about rubexy designs, zambian printing company, design company lusaka, corporate social responsibility"
      />

      <main>
        {/* Hero section */}
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
                contentKey="about.hero.title"
                fallback="About Rubexy Designs"
                render={(value) => (
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-brand">
                    {value}
                  </h1>
                )}
              />
              <EditText
                contentKey="about.hero.subtitle"
                fallback="Over a decade of creativity, innovation, and excellence in brand, print, and media solutions."
                render={(value) => (
                  <p className="text-xl text-gray-600 font-brand">
                    {value}
                  </p>
                )}
              />
            </div>
          </div>
        </section>

        {/* Company background */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <EditText
                contentKey="about.story.title"
                fallback="Our Story"
                render={(value) => (
                  <h2 className="text-3xl font-bold mb-6">
                    {value}
                  </h2>
                )}
              />
              <div className="prose prose-lg max-w-none">
                <EditText
                  contentKey="about.story.paragraph1"
                  fallback="Rubexy Designs Limited was established in 2012 as a PACRA business name (registered 2013) and incorporated as a Private Company Limited by Shares on December 15, 2021. From our humble beginnings, we have grown into one of Zambia's trusted providers of comprehensive brand, print, and media solutions."
                  render={(value) => (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {value}
                    </p>
                  )}
                />
                <EditText
                  contentKey="about.story.paragraph2"
                  fallback="Based in FINDECO House, Floor 12, Lusaka, we serve clients across Zambia and beyond. Our commitment to quality, professionalism, and efficiency has earned us the trust of leading organizations, government entities, and private businesses."
                  render={(value) => (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {value}
                    </p>
                  )}
                />
                <EditText
                  contentKey="about.story.paragraph3"
                  fallback="We are fully compliant with Zambian regulations, holding current certifications from PACRA, ZRA (Tax Clearance valid through December 2025), NAPSA (valid through June 2025), and ZPPA supplier registration (valid through March 2026)."
                  render={(value) => (
                    <p className="text-muted-foreground leading-relaxed">
                      {value}
                    </p>
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision and Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="h-8 w-8 text-primary" aria-hidden="true" />
                    <EditText
                      contentKey="about.vision.title"
                      fallback="Our Vision"
                      render={(value) => (
                        <CardTitle className="text-2xl">
                          {value}
                        </CardTitle>
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <EditText
                    contentKey="about.vision.content"
                    fallback="To maintain long-term business relations by providing quality products and services professionally. We envision being the partner of choice for businesses seeking reliable, innovative, and comprehensive brand and media solutions."
                    render={(value) => (
                      <p className="text-muted-foreground leading-relaxed">
                        {value}
                      </p>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-8 w-8 text-primary" aria-hidden="true" />
                    <EditText
                      contentKey="about.mission.title"
                      fallback="Our Mission"
                      render={(value) => (
                        <CardTitle className="text-2xl">
                          {value}
                        </CardTitle>
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <EditText
                    contentKey="about.mission.content"
                    fallback="To provide solution-based products and services in an innovative, professional, and efficient manner. We are committed to understanding our clients' unique needs and delivering tailored solutions that exceed expectations."
                    render={(value) => (
                      <p className="text-muted-foreground leading-relaxed">
                        {value}
                      </p>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <EditText
                contentKey="about.whatwedo.title"
                fallback="What We Do"
                render={(value) => (
                  <h2 className="text-3xl font-bold mb-6 text-center">
                    {value}
                  </h2>
                )}
              />
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <EditText
                      contentKey="about.whatwedo.print.title"
                      fallback="Print"
                      render={(value) => (
                        <CardTitle>
                          {value}
                        </CardTitle>
                      )}
                    />
                    <EditText
                      contentKey="about.whatwedo.print.description"
                      fallback="High-quality print production for reports, stationery, signage, and marketing materials."
                      render={(value) => (
                        <CardDescription>
                          {value}
                        </CardDescription>
                      )}
                    />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <EditText
                          contentKey="about.whatwedo.print.item1"
                          fallback="• Books, magazines, posters, flyers"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.print.item2"
                          fallback="• Certificates, business cards, letterheads"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.print.item3"
                          fallback="• Annual reports, corporate profiles, and manuals"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.print.item4"
                          fallback="• Banners, billboards, and large-format signage"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.print.item5"
                          fallback="• Catalogues, brochures, and branded documents"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.print.item6"
                          fallback="• Forms, invoices, quotations, and office stationery"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <EditText
                      contentKey="about.whatwedo.brand.title"
                      fallback="Brand"
                      render={(value) => (
                        <CardTitle>
                          {value}
                        </CardTitle>
                      )}
                    />
                    <EditText
                      contentKey="about.whatwedo.brand.description"
                      fallback="Identity, corporate wear, vehicle branding, and signage that strengthen your brand presence."
                      render={(value) => (
                        <CardDescription>
                          {value}
                        </CardDescription>
                      )}
                    />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <EditText
                          contentKey="about.whatwedo.brand.item1"
                          fallback="• Corporate wear supply & branding"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.brand.item2"
                          fallback="• Vehicle branding & signage"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.brand.item3"
                          fallback="• Office branding & embroidery"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.brand.item4"
                          fallback="• Logo and identity design"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.brand.item5"
                          fallback="• Signage and interior branding"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.brand.item6"
                          fallback="• Branded merchandise and packaging"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <EditText
                      contentKey="about.whatwedo.media.title"
                      fallback="Media"
                      render={(value) => (
                        <CardTitle>
                          {value}
                        </CardTitle>
                      )}
                    />
                    <EditText
                      contentKey="about.whatwedo.media.description"
                      fallback="Professional photography and video production"
                      render={(value) => (
                        <CardDescription>
                          {value}
                        </CardDescription>
                      )}
                    />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <EditText
                          contentKey="about.whatwedo.media.item1"
                          fallback="• Professional photography"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.media.item2"
                          fallback="• Documentary production"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.media.item3"
                          fallback="• Video advertisements"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.media.item4"
                          fallback="• Corporate videography"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.media.item5"
                          fallback="• Event coverage"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                      <li>
                        <EditText
                          contentKey="about.whatwedo.media.item6"
                          fallback="• Product photography"
                          render={(value) => <span>{value}</span>}
                        />
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <AboutImageSlider />

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <EditText
                contentKey="about.values.title"
                fallback="Our Core Values"
                render={(value) => (
                  <h2 className="text-3xl font-bold mb-12">
                    {value}
                  </h2>
                )}
              />
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <EditText
                    contentKey="about.values.quality.title"
                    fallback="Quality"
                    render={(value) => (
                      <h3 className="text-xl font-semibold mb-2">
                        {value}
                      </h3>
                    )}
                  />
                  <EditText
                    contentKey="about.values.quality.description"
                    fallback="We never compromise on quality. Every project receives our full attention and expertise."
                    render={(value) => (
                      <p className="text-muted-foreground text-sm">
                        {value}
                      </p>
                    )}
                  />
                </div>
                <div>
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <EditText
                    contentKey="about.values.innovation.title"
                    fallback="Innovation"
                    render={(value) => (
                      <h3 className="text-xl font-semibold mb-2">
                        {value}
                      </h3>
                    )}
                  />
                  <EditText
                    contentKey="about.values.innovation.description"
                    fallback="We stay ahead of trends and technology to deliver cutting-edge solutions."
                    render={(value) => (
                      <p className="text-muted-foreground text-sm">
                        {value}
                      </p>
                    )}
                  />
                </div>
                <div>
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <EditText
                    contentKey="about.values.partnership.title"
                    fallback="Partnership"
                    render={(value) => (
                      <h3 className="text-xl font-semibold mb-2">
                        {value}
                      </h3>
                    )}
                  />
                  <EditText
                    contentKey="about.values.partnership.description"
                    fallback="We build lasting relationships based on trust, transparency, and mutual success."
                    render={(value) => (
                      <p className="text-muted-foreground text-sm">
                        {value}
                      </p>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}


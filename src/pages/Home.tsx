import { Link } from 'react-router-dom'
import { Hero } from '@/components/Hero'
import { PortfolioGrid } from '@/components/PortfolioGrid'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { usePortfolioItems } from '@/hooks/usePortfolioItems'
import { EditText } from '@/components/EditText'

/**
 * Home page component
 * Features: Hero section, featured portfolio, compliance badges, CSR note, contact CTA
 */
export function Home() {
  const { data: portfolioItems = [] } = usePortfolioItems()
  const visibleFeaturedPortfolio = portfolioItems.filter((item) => item.featured).slice(0, 6)

  return (
    <>
      <SEO
        title="Rubexy Designs Limited | Creativity Unlimited"
        description="Rubexy Designs Limited delivers high-quality brand, print, and media solutions for businesses in Zambia and beyond—from corporate wear and large-format signage to photography and documentaries."
        keywords="printing services zambia, branding lusaka, corporate wear zambia, vehicle branding, photography zambia, documentary production"
      />

      <main>
        {/* Hero section */}
        <Hero />

        {/* Featured portfolio */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <EditText
                contentKey="home.featured.title"
                fallback="Featured Work"
                render={(value) => (
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {value}
                  </h2>
                )}
              />
              <EditText
                contentKey="home.featured.description"
                fallback="Explore some of our recent projects"
                render={(value) => (
                  <p className="text-muted-foreground mt-2">
                    {value}
                  </p>
                )}
              />
            </div>
            <PortfolioGrid items={visibleFeaturedPortfolio} showFilters={false} />
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link to="/portfolio">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <EditText
              contentKey="home.cta.title"
              fallback="Ready to Start Your Project?"
              render={(value) => (
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-brand">
                  {value}
                </h2>
              )}
            />
            <EditText
              contentKey="home.cta.description"
              fallback="Let's discuss how we can help bring your vision to life"
              render={(value) => (
                <p className="text-lg mb-8 opacity-90 font-brand">
                  {value}
                </p>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100 font-brand">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-brand">
                <Link to="/rfq">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}


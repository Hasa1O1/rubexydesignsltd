import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { EditText } from '@/components/EditText'
import { Button } from '@/components/ui/button'

const heroTitleFallback = 'Creativity Unlimited'
const heroSubtitleFallback =
  'Rubexy Designs Limited delivers high-quality brand, print, and media solutions for businesses in Zambia and beyond-from corporate wear and large-format signage to photography and documentaries. Our clients trust our professional, efficient service and long-term partnership mindset.'

/**
 * Hero section for the home page
 * Features prominent tagline and call-to-action buttons
 * Updated to match PDF design with orange/grey color scheme
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Orange Line */}
          <div className="w-full h-1 bg-orange-500 mb-8"></div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white font-brand mb-6">
            <EditText
              contentKey="home.hero.title"
              fallback={heroTitleFallback}
              render={(value) => {
                const titleWords = value.split(' ')
                const accentWord = titleWords.pop()
                const titleStart = titleWords.join(' ')

                return (
                  <>
                    {titleStart} {accentWord && <span className="text-orange-500">{accentWord}</span>}
                  </>
                )
              }}
            />
          </h1>

          {/* Elevator pitch */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl font-brand leading-relaxed">
            <EditText
              contentKey="home.hero.subtitle"
              fallback={heroSubtitleFallback}
              multiline
              render={(value) => value}
            />
          </p>

          {/* Services */}
          <div className="mt-8 mb-12">
            <div className="flex items-center justify-center space-x-4 text-white">
              <EditText
                contentKey="home.hero.service.print"
                fallback="PRINT"
                render={(value) => (
                  <span className="text-lg font-bold tracking-wider font-brand">{value}</span>
                )}
              />
              <div className="w-1 h-6 bg-orange-500"></div>
              <EditText
                contentKey="home.hero.service.brand"
                fallback="BRAND"
                render={(value) => (
                  <span className="text-lg font-bold tracking-wider font-brand">{value}</span>
                )}
              />
              <div className="w-1 h-6 bg-orange-500"></div>
              <EditText
                contentKey="home.hero.service.media"
                fallback="MEDIA"
                render={(value) => (
                  <span className="text-lg font-bold tracking-wider font-brand">{value}</span>
                )}
              />
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg" className="gap-2 border-white text-white hover:bg-white hover:text-gray-900 font-brand">
              <Link to="/portfolio">
                <Eye className="h-4 w-4" />
                See Portfolio
              </Link>
            </Button>
          </div>

          {/* Service clusters */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-orange-200 bg-white/10 backdrop-blur p-6 text-left shadow-lg">
              <EditText
                contentKey="home.hero.cluster.print.title"
                fallback="Print"
                render={(value) => (
                  <h3 className="text-lg font-semibold text-white font-brand">{value}</h3>
                )}
              />
              <EditText
                contentKey="home.hero.cluster.print.description"
                fallback="High quality print production for business stationery, marketing materials, and signage."
                render={(value) => (
                  <p className="mt-2 text-sm text-gray-300 font-brand">{value}</p>
                )}
              />
            </div>
            <div className="rounded-2xl border-2 border-orange-200 bg-white/10 backdrop-blur p-6 text-left shadow-lg">
              <EditText
                contentKey="home.hero.cluster.brand.title"
                fallback="Brand"
                render={(value) => (
                  <h3 className="text-lg font-semibold text-white font-brand">{value}</h3>
                )}
              />
              <EditText
                contentKey="home.hero.cluster.brand.description"
                fallback="Creative brand identity, corporate wear, and vehicle graphics that help your business stand out."
                render={(value) => (
                  <p className="mt-2 text-sm text-gray-300 font-brand">{value}</p>
                )}
              />
            </div>
            <div className="rounded-2xl border-2 border-orange-200 bg-white/10 backdrop-blur p-6 text-left shadow-lg">
              <EditText
                contentKey="home.hero.cluster.media.title"
                fallback="Media"
                render={(value) => (
                  <h3 className="text-lg font-semibold text-white font-brand">{value}</h3>
                )}
              />
              <EditText
                contentKey="home.hero.cluster.media.description"
                fallback="Professional photography, documentaries, and video advertising."
                render={(value) => (
                  <p className="mt-2 text-sm text-gray-300 font-brand">{value}</p>
                )}
              />
            </div>
          </div>

          {/* Bottom Curved Elements */}
          <div className="relative mt-16">
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-white to-orange-500 transform -skew-y-1"></div>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-orange-500 transform -skew-y-2"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

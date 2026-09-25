import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { useContentValue } from '@/hooks/useSiteContent'
import { useAuth } from '@/contexts/AuthContext'

interface ImageCardSliderProps {
  titleKey: string
  fallbackTitle: string
  imageKeys: string[]
  className?: string
}

export function ImageCardSlider({ titleKey, fallbackTitle, imageKeys, className = '' }: ImageCardSliderProps) {
  const { isAdmin } = useAuth()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const images = imageKeys.map((key) => useContentValue(key, '')).filter(Boolean)

  useEffect(() => {
    setActiveIndex((current) => (images.length ? Math.min(current, images.length - 1) : 0))
  }, [images.length])

  const goToPrevious = () => {
    if (images.length <= 1) return
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const goToNext = () => {
    if (images.length <= 1) return
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  const getOffset = (index: number) => {
    if (images.length <= 1) return 0
    let offset = index - activeIndex
    if (offset > images.length / 2) offset -= images.length
    if (offset < -images.length / 2) offset += images.length
    return offset
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 text-center">
            <EditText
              contentKey={titleKey}
              fallback={fallbackTitle}
              render={(value) => <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">{value}</h2>}
            />
          </div>

          {images.length > 0 ? (
            <>
              <div className="relative mx-auto h-[280px] w-full max-w-5xl overflow-hidden sm:h-[430px]">
                {images.map((src, index) => {
                  const offset = getOffset(index)
                  if (Math.abs(offset) > 2) return null

                  const isActive = offset === 0
                  return (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={isActive ? `Current image ${index + 1}` : `View image ${index + 1}`}
                      className="absolute top-1/2 overflow-hidden rounded-xl border border-white bg-white p-0 shadow-[0_16px_28px_rgba(15,23,42,0.18)] transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400"
                      style={{
                        left: `calc(50% + ${offset * 16}vw)`,
                        width: 'clamp(110px, 22vw, 300px)',
                        aspectRatio: '1 / 1',
                        opacity: Math.abs(offset) === 2 ? 0.72 : 1,
                        transform: `translate(-50%, -50%) scale(${isActive ? 1.16 : 0.9})`,
                        zIndex: 10 - Math.abs(offset),
                      }}
                    >
                      <img src={src} alt={`Gallery image ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  )
                })}
              </div>

              {images.length > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={goToPrevious}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-orange-400 hover:text-orange-500"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to image ${index + 1}`}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-slate-300'}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={goToNext}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-orange-400 hover:text-orange-500"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                aria-label="Expand gallery"
                onClick={() => setIsExpanded(true)}
                className="mx-auto mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-[0_12px_25px_rgba(15,23,42,0.12)] transition hover:text-orange-500"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              No gallery images uploaded yet.
            </div>
          )}

          {isAdmin && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {imageKeys.map((key, index) => (
                <UploadImage key={key} contentKey={key} label={`Upload image ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isExpanded && images.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-6" role="dialog" aria-modal="true" aria-label="Expanded gallery">
          <button
            type="button"
            aria-label="Close expanded gallery"
            onClick={() => setIsExpanded(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:text-orange-500"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={images[activeIndex]} alt={`Expanded gallery image ${activeIndex + 1}`} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </section>
  )
}

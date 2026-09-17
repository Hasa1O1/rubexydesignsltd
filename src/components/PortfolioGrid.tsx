import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight, Edit3, Trash } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  featured: boolean
  images: string[]
  client?: string
}

interface PortfolioGridProps {
  items?: PortfolioItem[]
  showFilters?: boolean
}

/**
 * Portfolio grid with category filtering
 * Displays portfolio items in a responsive grid with optional category filters
 */
export function PortfolioGrid({ items = [], showFilters = true }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(items.map((item) => item.category)))]
  const filteredItems =
    selectedCategory === 'all' ? items : items.filter((item) => item.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Category filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found in this category.</p>
        </div>
      )}
    </div>
  )
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [currentImage, setCurrentImage] = useState(0)
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [category, setCategory] = useState(item.category)
  const [description, setDescription] = useState(item.description)
  const [client, setClient] = useState(item.client || '')
  const [featured, setFeatured] = useState(item.featured)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)

  useEffect(() => {
    setTitle(item.title)
    setCategory(item.category)
    setDescription(item.description)
    setClient(item.client || '')
    setFeatured(item.featured)
    setCurrentImage(0)
  }, [item])

  useEffect(() => {
    const descriptionElement = descriptionRef.current
    if (!descriptionElement) return

    setIsDescriptionTruncated(descriptionElement.scrollHeight > descriptionElement.clientHeight + 1)
  }, [item.description])

  const imageSources = Array.isArray(item.images) ? item.images : []
  const hasMultipleImages = imageSources.length > 1

  const showPrevious = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setCurrentImage((prev) => (prev - 1 + imageSources.length) % imageSources.length)
  }

  const showNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setCurrentImage((prev) => (prev + 1) % imageSources.length)
  }

  const goToImage = (index: number) => {
    setCurrentImage(index)
  }

  const parseMissingColumn = (message: string | undefined): string | undefined => {
    if (!message) return undefined
    const regex1 = /column .*?\.?"?([a-zA-Z0-9_]+)"? does not exist/i
    const regex2 = /Could not find the '(.+?)' column/i
    return regex1.exec(message)?.[1] ?? regex2.exec(message)?.[1]
  }

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError('Title is required.')
      setIsSaving(false)
      return
    }

    try {
      let updatedImageUrls: string[] | undefined

      if (uploadFiles.length > 0) {
        updatedImageUrls = []
        for (const uploadFile of uploadFiles) {
          const safeName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const filePath = `portfolio/${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${safeName}`
          const { error: uploadError } = await supabase.storage.from('images').upload(filePath, uploadFile, {
            cacheControl: '3600',
            upsert: true,
          })

          if (uploadError) throw uploadError
          updatedImageUrls.push(supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl)
        }
      }

      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || null,
        client: client.trim() || null,
        featured,
      }

      if (category.trim()) {
        payload.category = category.trim()
      }

      if (updatedImageUrls?.length) {
        payload.image_url = updatedImageUrls[0]
        payload.images = updatedImageUrls
      }

      let updatePayload = { ...payload }

      while (true) {
        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update(updatePayload)
          .eq('id', item.id)
          .select()

        if (!updateError) {
          break
        }

        const missingColumn = parseMissingColumn(updateError.message)
        if (!missingColumn || !(missingColumn in updatePayload)) {
          throw updateError
        }

        delete updatePayload[missingColumn]
      }

      queryClient.setQueryData<PortfolioItem[]>(['portfolio-items'], (currentData = []) =>
        (Array.isArray(currentData) ? currentData : []).map((existing) =>
          existing.id === item.id
            ? {
                ...existing,
                title: title.trim(),
                category: category.trim(),
                description: description.trim(),
                client: client.trim() || undefined,
                featured,
                images: updatedImageUrls ?? existing.images,
              }
            : existing
        )
      )

      await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })

      setSuccess('Portfolio item updated successfully.')
      setUploadFiles([])
      setIsEditDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', item.id)

      if (deleteError) {
        throw deleteError
      }

      queryClient.setQueryData<PortfolioItem[]>(['portfolio-items'], (currentData = []) =>
        (Array.isArray(currentData) ? currentData : []).filter((existing) => existing.id !== item.id)
      )

      setSuccess('Portfolio item deleted successfully.')
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete portfolio item.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    event.currentTarget.dataset.touchStartX = String(event.touches[0]?.clientX ?? '')
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = Number(event.currentTarget.dataset.touchStartX)
    const endX = event.changedTouches[0]?.clientX ?? startX

    if (hasMultipleImages && Math.abs(endX - startX) > 40) {
      setCurrentImage((previous) =>
        endX < startX
          ? (previous + 1) % imageSources.length
          : (previous - 1 + imageSources.length) % imageSources.length
      )
    }
  }

  return (
    <Card className="group relative h-[min(32rem,calc(100dvh-7rem))] max-h-[calc(100dvh-7rem)] min-h-0 overflow-hidden rounded-2xl border-0 bg-black text-white transition-shadow hover:shadow-xl">
      {/* Image slider */}
      <div
        className="absolute inset-0 overflow-hidden bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {imageSources.map((src, index) => (
          <img
            key={`${item.id}-${index}`}
            src={src}
            alt={`${item.title} - view ${index + 1}`}
            loading="lazy"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
              index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          />
        ))}

        {/* Overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {isAdmin && (
          <div className="pointer-events-auto absolute right-3 top-3 z-20 flex items-center gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="bg-white/90 text-gray-900 shadow-sm"
                aria-label={`Edit ${item.title}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setError(null)
                  setSuccess(null)
                  setIsEditDialogOpen(true)
                }}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit portfolio item</DialogTitle>
                  <DialogDescription>
                    Update title, category, client, description, or upload a new image for <strong>{item.title}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4">
                  <div>
                    <Label htmlFor={`edit-title-${item.id}`}>Title</Label>
                    <Input
                      id={`edit-title-${item.id}`}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-category-${item.id}`}>Category</Label>
                    <Input
                      id={`edit-category-${item.id}`}
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-client-${item.id}`}>Client</Label>
                    <Input
                      id={`edit-client-${item.id}`}
                      value={client}
                      onChange={(event) => setClient(event.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-description-${item.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${item.id}`}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-image-${item.id}`}>Upload new image</Label>
                    <Input
                      id={`edit-image-${item.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setUploadFiles(Array.from(event.target.files ?? []))}
                      className="mt-2"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(event) => setFeatured(event.target.checked)}
                    />
                    Display in Featured Work on the home page
                  </label>
                </form>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {success && <p className="text-sm text-success">{success}</p>}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="bg-white/90 text-red-700 shadow-sm"
                aria-label={`Delete ${item.title}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setError(null)
                  setSuccess(null)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete portfolio item</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete <strong>{item.title}</strong>? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Navigation controls */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="pointer-events-auto absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-md">
              {currentImage + 1}/{imageSources.length}
            </span>

            <div className="pointer-events-auto absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1">
              {imageSources.map((_, index) => (
                <button
                  key={`dot-${item.id}-${index}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    goToImage(index)
                  }}
                  className={cn(
                    'h-1.5 w-6 rounded-full transition-all',
                    index === currentImage ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 mt-auto flex h-full min-h-0 flex-col justify-end p-6 pt-32">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium uppercase tracking-wide text-orange-300">{item.category}</span>
        </div>

        <CardHeader className="p-0 pt-2">
          <CardTitle className="line-clamp-1 font-brand text-lg text-white">{item.title}</CardTitle>
          {item.client && <CardDescription className="text-white/75">Client: {item.client}</CardDescription>}
        </CardHeader>

        <CardContent className="flex min-h-0 flex-col p-0 pt-3">
          <p ref={descriptionRef} className="line-clamp-2 text-sm font-brand text-white/90">
            {item.description}
          </p>
          {isDescriptionTruncated && (
            <button
              type="button"
              className="mt-3 rounded-full bg-white/20 px-4 py-1 text-sm text-white backdrop-blur-md transition hover:bg-white/30"
              onClick={() => setIsDescriptionDialogOpen(true)}
            >
              See More
            </button>
          )}
        </CardContent>
      </div>

      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>{item.category}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60dvh] overflow-y-auto whitespace-pre-wrap pr-2 text-sm text-foreground">
            {item.description}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

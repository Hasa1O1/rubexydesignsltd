import { FormEvent, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { EditText } from '@/components/EditText'
import { UploadImage } from '@/components/UploadImage'
import { useContentValue } from '@/hooks/useSiteContent'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

/**
 * Logo wall component to display client logos
 * Shows a grid of client/partner logos with carousel and add functionality
 */
export function LogoWall() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientIndustry, setNewClientIndustry] = useState('')
  const [newClientFile, setNewClientFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [logos, setLogos] = useState([
    {
      id: 'dhl',
      name: 'DHL',
      description: 'Logistics & Delivery',
    },
    {
      id: 'breakthrough-cancer-trust',
      name: 'Breakthrough Cancer Trust',
      description: 'Healthcare NGO',
    },
    {
      id: 'client-3',
      name: 'Client 3',
      description: 'Industry Partner',
    },
    {
      id: 'client-4',
      name: 'Client 4',
      description: 'Corporate Partner',
    },
    {
      id: 'client-5',
      name: 'Client 5',
      description: 'Government Entity',
    },
    {
      id: 'client-6',
      name: 'Client 6',
      description: 'Private Sector',
    },
  ])

  async function handleAddClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)

    if (!newClientName.trim() || !newClientFile) {
      setError('Client name and photo are required.')
      setIsSaving(false)
      return
    }

    try {
      const safeName = newClientFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `clients/${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, newClientFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)

      const clientId = `client-${Date.now()}`
      const newClient = {
        id: clientId,
        name: newClientName.trim(),
        description: newClientIndustry.trim() || 'Partner',
      }

      setLogos([...logos, newClient])

      // Store the logo image
      await supabase.from('site_content').upsert(
        {
          key: `companyprofile.clients.logo.${clientId}`,
          value: data.publicUrl,
          type: 'image',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )

      // Store the name and description
      await supabase.from('site_content').upsert(
        {
          key: `companyprofile.clients.name.${clientId}`,
          value: newClientName.trim(),
          type: 'text',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )

      await supabase.from('site_content').upsert(
        {
          key: `companyprofile.clients.description.${clientId}`,
          value: newClientIndustry.trim() || 'Partner',
          type: 'text',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )

      queryClient.invalidateQueries({ queryKey: ['site-content'] })

      setNewClientName('')
      setNewClientIndustry('')
      setNewClientFile(null)
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteClient(clientId: string) {
    const confirmed = window.confirm('Delete this client card?')

    if (!confirmed) {
      return
    }

    setError(null)

    try {
      const keys = [
        `companyprofile.clients.logo.${clientId}`,
        `companyprofile.clients.name.${clientId}`,
        `companyprofile.clients.description.${clientId}`,
      ]

      const { error: deleteError } = await supabase.from('site_content').delete().in('key', keys)

      if (deleteError) {
        throw deleteError
      }

      setLogos((currentLogos) => currentLogos.filter((logo) => logo.id !== clientId))
      queryClient.invalidateQueries({ queryKey: ['site-content'] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client.')
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Trusted by Leading Organizations</h2>
          <p className="text-muted-foreground mt-2">
            We've had the privilege to work with amazing clients
          </p>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new client</DialogTitle>
                  <DialogDescription>
                    Enter the client name, industry, and upload a logo or photo.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddClient} className="grid gap-4">
                  <div>
                    <Label htmlFor="client-name">Client Name *</Label>
                    <Input
                      id="client-name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="e.g., Acme Corporation"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-industry">Industry</Label>
                    <Input
                      id="client-industry"
                      value={newClientIndustry}
                      onChange={(e) => setNewClientIndustry(e.target.value)}
                      placeholder="e.g., Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-photo">Logo/Photo *</Label>
                    <Input
                      id="client-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewClientFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" size="sm" disabled={isSaving}>
                      {isSaving ? 'Adding...' : 'Add Client'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <ClientCard key={logo.id} logo={logo} onDelete={handleDeleteClient} />
          ))}
        </div>

        {/* Notable mention */}
        <div className="mt-12 rounded-2xl border bg-primary/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Notable:</strong> We have successfully delivered services to DHL and continue
            to support Breakthrough Cancer Trust with media services for cancer awareness initiatives.
          </p>
        </div>
      </div>
    </section>
  )
}

function ClientCard({
  logo,
  onDelete,
}: {
  logo: { id: string; name: string; description: string }
  onDelete: (clientId: string) => void
}) {
  const { isAdmin } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const logoSrc = useContentValue(`companyprofile.clients.logo.${logo.id}`, '')
  const name = useContentValue(`companyprofile.clients.name.${logo.id}`, logo.name)

  const initials = name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 3)

  // For now, we show one image. In the future, support multiple images
  const images = logoSrc ? [logoSrc] : []
  const hasMultipleImages = images.length > 1

  const showPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const showNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative flex flex-col items-center justify-center rounded-lg border bg-card p-6 transition-all hover:shadow-md">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(logo.id)}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-red-200 hover:text-red-600"
          aria-label={`Delete ${name}`}
          title="Delete client"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {/* Image carousel */}
      <div className="mb-4 relative h-20 w-20 overflow-hidden rounded-full bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center group">
        {images.length > 0 ? (
          <>
            {images.map((src, index) => (
              <img
                key={`${logo.id}-${index}`}
                src={src}
                alt={`${name} - image ${index + 1}`}
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-300',
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute'
                )}
              />
            ))}

            {/* Carousel controls */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={showPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={showNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </>
            )}
          </>
        ) : (
          <span className="text-lg font-semibold text-slate-500">{initials}</span>
        )}
      </div>

      <div className="text-center">
        <EditText
          contentKey={`companyprofile.clients.name.${logo.id}`}
          fallback={logo.name}
          render={(value) => <div className="text-lg font-semibold text-slate-900">{value}</div>}
        />
        <EditText
          contentKey={`companyprofile.clients.description.${logo.id}`}
          fallback={logo.description}
          render={(value) => <div className="mt-2 text-xs text-muted-foreground">{value}</div>}
        />
      </div>

      <div className="mt-4">
        <UploadImage
          contentKey={`companyprofile.clients.logo.${logo.id}`}
          label="Upload logo"
          className="justify-center"
        />
      </div>
    </div>
  )
}



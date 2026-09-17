import { ChangeEvent, FormEvent, useState } from 'react'
import { ImageUp, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function PortfolioAdminForm() {
  const queryClient = useQueryClient()
  const { isAdmin } = useAuth()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [client, setClient] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isAdmin) {
    return null
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const form = event.currentTarget

    if (!title.trim() || files.length === 0) {
      setError('Add a title and image before saving.')
      return
    }

    setIsSaving(true)

    try {
      const imageUrls: string[] = []

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const filePath = `portfolio/${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${safeName}`
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

        if (uploadError) throw uploadError
        imageUrls.push(supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl)
      }

      const insertPayload: Record<string, unknown> = {
        title: title.trim(),
        image_url: imageUrls[0],
        images: imageUrls,
        description: description.trim() || null,
        client: client.trim() || null,
      }

      if (category.trim()) {
        insertPayload.category = category.trim()
      }

      const parseMissingColumn = (message: string | undefined): string | undefined => {
        if (!message) return undefined
        const regex1 = /column .*?\.?"?([a-zA-Z0-9_]+)"? does not exist/i
        const regex2 = /Could not find the '(.+?)' column/i
        return regex1.exec(message)?.[1] ?? regex2.exec(message)?.[1]
      }

      let payload = { ...insertPayload }
      let insertedData: any = null
      while (true) {
        const { data: insertData, error: insertError } = await supabase
          .from('portfolio_items')
          .insert(payload)
          .select()

        if (!insertError) {
          insertedData = insertData
          break
        }

        const missingColumn = parseMissingColumn(insertError.message)
        if (!missingColumn || !(missingColumn in payload)) {
          throw insertError
        }

        delete payload[missingColumn]
      }

      setTitle('')
      setCategory('')
      setDescription('')
      setClient('')
      setFiles([])
      form.reset()

      if (insertedData && Array.isArray(insertedData) && insertedData.length > 0) {
        const insertedItem = insertedData[0]
        queryClient.setQueryData<unknown[]>(['portfolio-items'], (currentData = []) => {
          const existing = Array.isArray(currentData) ? currentData : []
          const newItem = {
            id: insertedItem.id,
            title: insertedItem.title,
            category: insertedItem.category || 'Portfolio',
            description: insertedItem.description || '',
            imageUrl: insertedItem.image_url,
            images: insertedItem.images?.length ? insertedItem.images : insertedItem.image_url ? [insertedItem.image_url] : [],
            client: insertedItem.client || undefined,
            year: insertedItem.year || new Date(insertedItem.created_at).getFullYear(),
          }
          return [newItem, ...existing]
        })
      }

      await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })
      setSuccessMessage('Portfolio item added successfully.')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message ?? 'Failed to save portfolio item'
          : 'Failed to save portfolio item'
      console.error('Portfolio save error:', err)
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-md border border-orange-200 bg-orange-50 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="portfolio-title">Title *</Label>
          <Input
            id="portfolio-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Project title"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="portfolio-description">Description</Label>
          <Input
            id="portfolio-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Brief project description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio-client">Client</Label>
          <Input
            id="portfolio-client"
            value={client}
            onChange={(event) => setClient(event.target.value)}
            placeholder="Client name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio-image">Images *</Label>
          <Input id="portfolio-image" type="file" accept="image/*" multiple onChange={handleFileChange} required />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="gap-2 w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <ImageUp className="h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add item
              </>
            )}
          </Button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {successMessage && <p className="mt-3 text-sm text-emerald-600">{successMessage}</p>}
    </form>
  )
}

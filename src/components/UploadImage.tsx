import { ChangeEvent, useRef, useState } from 'react'
import { Check, ImageUp, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useContentValue } from '@/hooks/useSiteContent'

interface UploadImageProps {
  contentKey: string
  label?: string
  className?: string
}

export function UploadImage({ contentKey, label = 'Upload image', className }: UploadImageProps) {
  const queryClient = useQueryClient()
  const { isAdmin } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const imageUrl = useContentValue(contentKey, '')

  if (!isAdmin) {
    return null
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setIsUploading(true)
    setError(null)

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `${contentKey}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      setIsUploading(false)
      setError(uploadError.message)
      event.target.value = ''
      return
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)

    const { error: saveError } = await supabase
      .from('site_content')
      .upsert(
        {
          key: contentKey,
          value: data.publicUrl,
          type: 'image',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )

    setIsUploading(false)
    event.target.value = ''

    if (saveError) {
      setError(saveError.message)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['site-content'] })
  }

  async function handleDelete() {
    if (!window.confirm('Delete this uploaded image?')) return

    setIsDeleting(true)
    setError(null)

    const { error: deleteError } = await supabase.from('site_content').delete().eq('key', contentKey)

    if (deleteError) {
      setError(deleteError.message)
      setIsDeleting(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['site-content'] })
    setIsDeleting(false)
  }

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="gap-2 shadow-lg"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || isDeleting}
      >
        {imageUrl ? <Check className="h-4 w-4 text-emerald-600" /> : <ImageUp className="h-4 w-4" />}
        {isUploading ? 'Uploading...' : imageUrl ? 'Image uploaded' : label}
      </Button>
      {imageUrl && (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleDelete}
          disabled={isUploading || isDeleting}
          aria-label="Delete uploaded image"
          title="Delete uploaded image"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  )
}

import { useQuery } from '@tanstack/react-query'
import type { PortfolioItem } from '@/components/PortfolioGrid'
import { supabase } from '@/lib/supabase'

interface PortfolioItemRow {
  id: string
  title: string
  image_url: string
  images?: string[] | null
  description?: string | null
  client?: string | null
  year?: number | null
  created_at: string
}

function parseMissingColumn(message: string | undefined): string | undefined {
  if (!message) return undefined
  const regex1 = /column .*?\.?"?([a-zA-Z0-9_]+)"? does not exist/i
  const regex2 = /Could not find the '(.+?)' column/i

  return regex1.exec(message)?.[1] ?? regex2.exec(message)?.[1]
}

export function usePortfolioItems() {
  return useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async () => {
      const columns = ['id', 'title', 'image_url', 'images', 'description', 'client', 'year', 'created_at']
      let selectedColumns = [...columns]
      let lastError: Error | null = null

      while (selectedColumns.length > 0) {
        const response = await supabase
          .from('portfolio_items')
          .select(selectedColumns.join(','))
          .order('created_at', { ascending: false })

        const data = response.data as PortfolioItemRow[] | null
        const error = response.error

        if (!error) {
          return (data ?? []).map((item): PortfolioItem => ({
            id: item.id,
            title: item.title,
            category: 'Portfolio',
            description: item.description || 'Rubexy Designs project',
            imageUrl: item.image_url,
            images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image_url],
            client: item.client || undefined,
            year: item.year ?? new Date(item.created_at).getFullYear(),
          }))
        }

        lastError = error
        const missing = parseMissingColumn(error.message)
        if (!missing || !selectedColumns.includes(missing)) {
          throw error
        }

        selectedColumns = selectedColumns.filter((column) => column !== missing)
      }

      throw lastError ?? new Error('Failed to load portfolio items')
    },
  })
}

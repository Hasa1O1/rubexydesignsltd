import { useQuery } from '@tanstack/react-query'
import type { PortfolioItem } from '@/components/PortfolioGrid'
import { supabase } from '@/lib/supabase'

interface PortfolioItemRow {
  id: string
  title: string
  image_url: string
  images: string[]
  category?: string | null
  description?: string | null
  client?: string | null
  featured?: boolean | null
  created_at: string
}

export function usePortfolioItems() {
  return useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id, title, image_url, images, category, description, client, featured, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data as PortfolioItemRow[] | null ?? []).map((item): PortfolioItem => ({
        id: item.id,
        title: item.title,
        category: item.category ?? '',
        description: item.description ?? '',
        featured: item.featured === true,
        images: Array.isArray(item.images) ? item.images : [],
        client: item.client ?? undefined,
      }))
    },
  })
}

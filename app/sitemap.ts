import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/post/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/busca`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...postEntries,
  ]
}

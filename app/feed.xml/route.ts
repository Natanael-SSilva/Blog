import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types'
import { generateExcerpt } from '@/lib/utils'

// Gera /feed.xml acessível por leitores de RSS
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Meu Blog'
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || ''

  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const posts = (data as Post[]) || []

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/post/${post.slug}`
      const excerpt = post.excerpt || generateExcerpt(post.content)
      const pubDate = new Date(post.created_at).toUTCString()

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
      ${post.cover_image ? `<enclosure url="${post.cover_image}" type="image/jpeg"/>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Cache por 1 hora — posts mudam raramente
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}

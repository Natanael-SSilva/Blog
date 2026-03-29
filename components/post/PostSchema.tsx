import { Post } from '@/types'

interface PostSchemaProps {
  post: Post
  siteUrl: string
  siteName: string
}

// Injeta JSON-LD invisível no HTML — o Google lê isso para rich snippets
// Aparece nos resultados de busca com data, autor e imagem do post
export default function PostSchema({ post, siteUrl, siteName }: PostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    url: `${siteUrl}/post/${post.slug}`,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/post/${post.slug}`,
    },
    ...(post.cover_image && {
      image: {
        '@type': 'ImageObject',
        url: post.cover_image,
      },
    }),
    ...(post.tags.length > 0 && {
      keywords: post.tags.join(', '),
    }),
    inLanguage: 'pt-BR',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

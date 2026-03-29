import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PostOGImage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Meu Blog'
  const title = post?.title || siteName
  const excerpt = post?.excerpt || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#080e0a',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {post?.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #080e0a 50%, transparent 100%)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, transparent, #8b6914, #c9a84c, #8b6914, transparent)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'relative',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              display: 'flex',
            }}
          >
            ✦ {siteName}
          </div>

          <div
            style={{
              fontSize: title.length > 60 ? '42px' : '52px',
              fontWeight: 700,
              color: '#e8f0ea',
              lineHeight: 1.2,
              display: 'flex',
            }}
          >
            {title}
          </div>

          {excerpt && (
            <div
              style={{
                fontSize: '22px',
                color: '#8fa896',
                lineHeight: 1.5,
                display: 'flex',
                maxWidth: '900px',
              }}
            >
              {excerpt.length > 120 ? excerpt.slice(0, 120) + '…' : excerpt}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Post } from '@/types'
import Image from 'next/image'
import PostContent from '@/components/post/PostContent'
import MoodIndicator from '@/components/post/MoodIndicator'
import PostTags from '@/components/post/PostTags'
import Link from 'next/link'
import { formatDate, getReadingTime } from '@/lib/utils'
import { Calendar, Clock, ArrowLeft, Eye } from 'lucide-react'

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Preview acessa qualquer post — publicado ou rascunho
  const { data } = await supabase.from('posts').select('*').eq('id', id).single()

  if (!data) notFound()

  const post = data as Post
  const readingTime = getReadingTime(post.content)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Barra de aviso de preview */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--gold-deep)',
          padding: '0.625rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={14} color="var(--gold-pale)" />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              color: 'var(--gold-pale)',
              letterSpacing: '0.06em',
            }}
          >
            Modo preview — {post.published ? 'publicado' : 'rascunho'}
          </span>
        </div>
        <Link
          href={`/admin/posts/${id}/editar`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            color: 'var(--gold-pale)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
        >
          <ArrowLeft size={13} />
          Voltar ao editor
        </Link>
      </div>

      {/* Conteúdo do post — igual à página pública */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '3rem 1.5rem',
        }}
      >
        {post.cover_image && (
          <div
            style={{
              position: 'relative',
              height: '360px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '2.5rem',
              border: '1px solid var(--border)',
            }}
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, var(--bg) 0%, rgba(8,14,10,0.5) 50%, transparent 100%)',
              }}
            />
          </div>
        )}

        <header style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1rem',
              opacity: 0.8,
            }}
          >
            ✦ Publicação
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.8rem',
                color: 'var(--text-faint)',
              }}
            >
              <Calendar size={13} />
              {formatDate(post.created_at)}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.8rem',
                color: 'var(--text-faint)',
              }}
            >
              <Clock size={13} />
              {readingTime}
            </span>
          </div>

          {post.mood && post.mood_emoji && (
            <MoodIndicator mood={post.mood} emoji={post.mood_emoji} />
          )}

          <div
            style={{
              height: '1px',
              background: 'linear-gradient(to right, var(--gold-deep), transparent)',
              marginTop: '1.75rem',
              opacity: 0.5,
            }}
          />
        </header>

        <PostContent content={post.content} />

        {post.tags.length > 0 && <PostTags tags={post.tags} />}
      </div>
    </div>
  )
}

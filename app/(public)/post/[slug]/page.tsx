import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types'
import PostContent from '@/components/post/PostContent'
import MoodIndicator from '@/components/post/MoodIndicator'
import NewsletterForm from '@/components/ui/NewsletterForm'
import PostNav from '@/components/post/PostNav'
import PostTags from '@/components/post/PostTags'
import { formatDate, getReadingTime } from '@/lib/utils'
import { Calendar, Clock } from 'lucide-react'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return (data as Post) || null
}

async function getAdjacentPosts(postId: string, createdAt: string) {
  const supabase = await createClient()
  const [{ data: prev }, { data: next }] = await Promise.all([
    supabase
      .from('posts')
      .select('slug, title')
      .eq('published', true)
      .lt('created_at', createdAt)
      .neq('id', postId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('posts')
      .select('slug, title')
      .eq('published', true)
      .gt('created_at', createdAt)
      .neq('id', postId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single(),
  ])
  return {
    prev: prev as Pick<Post, 'slug' | 'title'> | null,
    next: next as Pick<Post, 'slug' | 'title'> | null,
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.cover_image ? [post.cover_image] : [],
      type: 'article',
      publishedTime: post.created_at,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const { prev, next } = await getAdjacentPosts(post.id, post.created_at)
  const readingTime = getReadingTime(post.content)

  return (
    <article>
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
            letterSpacing: '0.01em',
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

        {post.mood && post.mood_emoji && <MoodIndicator mood={post.mood} emoji={post.mood_emoji} />}

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

      {(prev || next) && <PostNav prev={prev} next={next} />}

      <div style={{ marginTop: '3rem' }}>
        <NewsletterForm />
      </div>
    </article>
  )
}

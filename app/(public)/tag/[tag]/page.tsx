export const revalidate = 600

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types'
import PostCard from '@/components/post/PostCard'
import { Tag } from 'lucide-react'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  return {
    title: `Posts com a tag "${decoded}"`,
    description: `Todos os posts marcados com "${decoded}"`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)

  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .contains('tags', [decoded])
    .order('created_at', { ascending: false })

  const posts = (data as Post[]) || []

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <Tag size={18} color="var(--emerald-light)" />
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              color: 'var(--text)',
              fontWeight: 600,
            }}
          >
            {decoded}
          </h1>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem',
            color: 'var(--text-faint)',
          }}
        >
          {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
        </p>

        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, var(--emerald-deep), transparent)',
            marginTop: '1rem',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Lista */}
      {posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'var(--text-faint)',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '3rem',
          }}
        >
          Nenhum post com essa tag ainda.
        </p>
      )}
    </div>
  )
}

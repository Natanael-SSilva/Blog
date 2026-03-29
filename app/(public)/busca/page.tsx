export const revalidate = 60

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types'
import PostCard from '@/components/post/PostCard'
import { Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Busca',
  description: 'Pesquise por posts do blog',
}

interface BuscaPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  let posts: Post[] = []

  if (query) {
    const supabase = await createClient()

    // Tenta full-text search primeiro
    const { data: ftData } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .textSearch('search_vector', query, {
        type: 'websearch',
        config: 'portuguese',
      })
      .order('created_at', { ascending: false })
      .limit(20)

    // Se não encontrou nada com full-text, cai para ilike como fallback
    if (ftData && ftData.length > 0) {
      posts = ftData as Post[]
    } else {
      const { data: likeData } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)
      posts = (likeData as Post[]) || []
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <Search size={18} color="var(--emerald-light)" />
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              color: 'var(--text)',
              fontWeight: 600,
            }}
          >
            Busca
          </h1>
        </div>

        <form method="GET" action="/busca">
          <div className="search-row">
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Buscar posts…"
              autoFocus
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                color: 'var(--text)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--emerald)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.5rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
        </form>
      </div>

      {query && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.82rem',
              color: 'var(--text-faint)',
              marginBottom: '1.5rem',
            }}
          >
            {posts.length === 0
              ? `Nenhum resultado para "${query}"`
              : `${posts.length} resultado${posts.length > 1 ? 's' : ''} para "${query}"`}
          </p>
          {posts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-faint)',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
          }}
        >
          Digite algo para começar a busca…
        </div>
      )}
    </div>
  )
}

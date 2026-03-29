import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types'
import PostCard from '@/components/post/PostCard'
import FeaturedPost from '@/components/post/FeaturedPost'

export const metadata: Metadata = {
  title: 'Início',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
}

// Home revalida a cada 5 minutos
// Posts novos aparecem sem precisar de redeploy
export const revalidate = 300

const PER_PAGE = 10

async function getPosts(page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const { data, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .eq('is_featured', false)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { posts: (data as Post[]) || [], total: count || 0 }
}

async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return (data as Post) || null
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  const [featuredPost, { posts, total }] = await Promise.all([getFeaturedPost(), getPosts(page)])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      {featuredPost && page === 1 && <FeaturedPost post={featuredPost} />}

      {featuredPost && page === 1 && (
        <div className="ornament-divider" style={{ marginBottom: '2rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              color: 'var(--gold)',
            }}
          >
            ✦
          </span>
        </div>
      )}

      {posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-faint)',
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            fontStyle: 'italic',
          }}
        >
          Nenhuma publicação ainda. Em breve…
        </div>
      )}

      {totalPages > 1 && (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '3rem',
            flexWrap: 'wrap',
          }}
          aria-label="Paginação"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/?page=${p}`}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                transition: 'all var(--transition)',
                borderColor: p === page ? 'var(--emerald)' : 'var(--border)',
                backgroundColor: p === page ? 'var(--emerald-deep)' : 'transparent',
                color: p === page ? 'var(--emerald-pale)' : 'var(--text-muted)',
              }}
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}

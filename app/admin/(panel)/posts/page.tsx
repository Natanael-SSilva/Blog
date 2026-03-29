import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import AdminPostActions from '@/components/admin/AdminPostActions'

async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as Post[]) || []
}

export default async function AdminPostsPage() {
  const posts = await getAllPosts()

  const published = posts.filter((p) => p.published).length
  const drafts = posts.filter((p) => !p.published).length

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              color: 'var(--text)',
              marginBottom: '0.4rem',
            }}
          >
            Posts
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
            {published} publicado{published !== 1 ? 's' : ''} · {drafts} rascunho{drafts !== 1 ? 's' : ''}
          </p>
        </div>

        <Link
          href="/admin/posts/novo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--emerald)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 1.25rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            color: 'var(--text)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color var(--transition)',
          }}
        >
          <Plus size={15} />
          Novo post
        </Link>
      </div>

      {/* Tabela */}
      {posts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--text-faint)',
            fontStyle: 'italic',
          }}
        >
          Nenhum post ainda.{' '}
          <Link href="/admin/posts/novo" style={{ color: 'var(--emerald-light)' }}>
            Criar o primeiro →
          </Link>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Cabeçalho da tabela */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 120px 140px',
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface-2)',
            }}
          >
            {['Título', 'Status', 'Tags', 'Data'].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Linhas */}
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px 140px',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
                transition: 'background-color var(--transition)',
              }}
            >
              {/* Título */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {post.is_featured && (
                    <span
                      style={{
                        fontSize: '0.6rem',
                        backgroundColor: 'var(--gold-deep)',
                        color: 'var(--gold-pale)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-ui)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                      }}
                    >
                      Fixado
                    </span>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/editar`}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      color: 'var(--text)',
                      textDecoration: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      transition: 'color var(--transition)',
                    }}
                  >
                    {post.title}
                  </Link>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.7rem',
                    color: 'var(--text-faint)',
                    marginTop: '2px',
                    display: 'block',
                  }}
                >
                  /{post.slug}
                </span>
              </div>

              {/* Status */}
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: post.published
                      ? 'rgba(64,145,108,0.15)'
                      : 'var(--bg-surface-2)',
                    color: post.published ? 'var(--emerald-light)' : 'var(--text-faint)',
                    border: `1px solid ${post.published ? 'var(--emerald-deep)' : 'var(--border)'}`,
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: post.published ? 'var(--emerald-light)' : 'var(--text-faint)',
                      flexShrink: 0,
                    }}
                  />
                  {post.published ? 'Publicado' : 'Rascunho'}
                </span>
              </div>

              {/* Tags */}
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.72rem',
                  color: 'var(--text-faint)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {post.tags.length > 0 ? post.tags.slice(0, 2).join(', ') : '—'}
              </div>

              {/* Data + ações */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.72rem',
                    color: 'var(--text-faint)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatDate(post.created_at)}
                </span>
                <AdminPostActions post={post} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

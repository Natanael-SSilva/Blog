'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { CommentWithReplies } from '@/types'
import CommentItem from './CommentItem'
import CommentForm from './CommentForm'
import AuthModal from './AuthModal'
import { MessageSquare, LogOut, User, Loader2 } from 'lucide-react'

interface CommentsSectionProps {
  postId: string
  commentsEnabled: boolean
}

function countAll(items: CommentWithReplies[]): number {
  return items.reduce((acc, c) => acc + 1 + countAll(c.replies || []), 0)
}

export default function CommentsSection({ postId, commentsEnabled }: CommentsSectionProps) {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?postId=${postId}`)
    const data = await res.json()
    if (data.comments) {
      setComments(data.comments)
      // Conta total incluindo respostas recursivamente
      setTotal(countAll(data.comments))
    }
    setLoading(false)
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  async function handleComment(content: string): Promise<string | null> {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    })
    const data = await res.json()
    if (!res.ok) return data.error
    await fetchComments()
    return null
  }

  async function handleReply(parentId: string, content: string): Promise<string | null> {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, parentId, content }),
    })
    const data = await res.json()
    if (!res.ok) return data.error
    await fetchComments()
    return null
  }

  async function handleEdit(commentId: string, content: string): Promise<string | null> {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const data = await res.json()
    if (!res.ok) return data.error
    await fetchComments()
    return null
  }

  async function handleDelete(commentId: string): Promise<void> {
    await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
    await fetchComments()
  }

  return (
    <section
      style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.8,
            }}
          >
            ✦
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              color: 'var(--text)',
              fontWeight: 600,
            }}
          >
            Comentários
            {!loading && total > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.82rem',
                  color: 'var(--text-faint)',
                  fontWeight: 400,
                  marginLeft: '0.5rem',
                }}
              >
                ({total})
              </span>
            )}
          </h2>
        </div>

        {/* Info do usuário logado */}
        {!authLoading && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--emerald-deep)',
                border: '1px solid var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '0.65rem',
                color: 'var(--emerald-light)',
                fontWeight: 600,
              }}
            >
              {profile?.name?.[0]?.toUpperCase() || <User size={12} />}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              {profile?.name}
            </span>
            <button
              onClick={signOut}
              title="Sair"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#e57373'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-faint)'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Comentários desativados */}
      {!commentsEnabled ? (
        <div
          style={{
            textAlign: 'center',
            padding: '2.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <MessageSquare size={28} color="var(--text-faint)" style={{ margin: '0 auto 0.75rem' }} />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--text-faint)',
              fontStyle: 'italic',
            }}
          >
            Comentários desativados neste post.
          </p>
        </div>
      ) : (
        <>
          {/* Formulário principal */}
          {!authLoading && (
            <div style={{ marginBottom: '2rem' }}>
              {user ? (
                <CommentForm onSubmit={handleComment} placeholder="Compartilhe sua opinião…" />
              ) : (
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.975rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem',
                    }}
                  >
                    Entre para deixar um comentário.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    style={{
                      backgroundColor: 'var(--emerald)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 1.5rem',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.82rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Entrar / Criar conta
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Lista de comentários */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 size={22} color="var(--text-faint)" />
            </div>
          ) : comments.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem',
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
              }}
            >
              Seja o primeiro a comentar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <CommentItem
                    comment={comment}
                    postId={postId}
                    depth={0}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de autenticação */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </section>
  )
}

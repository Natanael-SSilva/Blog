'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { CommentWithReplies } from '@/types'
import { formatDateRelative } from '@/lib/utils'
import CommentForm from './CommentForm'
import { Trash2, Pencil, CornerDownRight, ChevronDown, ChevronUp, Shield } from 'lucide-react'

interface CommentItemProps {
  comment: CommentWithReplies
  postId: string
  depth?: number
  onReply: (parentId: string, content: string) => Promise<string | null>
  onEdit: (commentId: string, content: string) => Promise<string | null>
  onDelete: (commentId: string) => Promise<void>
}

const MAX_VISUAL_DEPTH = 4 // máximo de indentação visual

export default function CommentItem({
  comment,
  postId,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const { user, profile } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  const isOwner = user?.id === comment.user_id
  const isAdmin = profile?.is_admin === true
  const canEdit = isOwner && !comment.is_deleted
  const canDelete = (isOwner || isAdmin) && !comment.is_deleted
  const hasReplies = comment.replies && comment.replies.length > 0
  const indentLevel = Math.min(depth, MAX_VISUAL_DEPTH)

  const indentPx = indentLevel * 20

  return (
    <div style={{ marginLeft: depth > 0 ? `${indentPx}px` : 0 }}>
      {/* Linha de thread para respostas */}
      <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
        {depth > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '-13px',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'var(--border)',
            }}
          />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Cabeçalho */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.4rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar inicial */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--emerald-deep)',
                border: '1px solid var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '0.7rem',
                color: 'var(--emerald-light)',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {comment.profile?.name?.[0]?.toUpperCase() || '?'}
            </div>

            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                color: 'var(--text)',
                fontWeight: 500,
              }}
            >
              {comment.profile?.name || 'Usuário'}
            </span>

            {comment.profile?.is_admin && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  backgroundColor: 'rgba(201,168,76,0.1)',
                  border: '1px solid var(--gold-deep)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.1rem 0.4rem',
                }}
              >
                <Shield size={9} />
                Autor
              </span>
            )}

            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                color: 'var(--text-faint)',
              }}
            >
              {formatDateRelative(comment.created_at)}
            </span>

            {comment.updated_at !== comment.created_at && !comment.is_deleted && (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.65rem',
                  color: 'var(--text-faint)',
                  fontStyle: 'italic',
                }}
              >
                (editado)
              </span>
            )}
          </div>

          {/* Conteúdo */}
          {isEditing ? (
            <div style={{ marginBottom: '0.75rem' }}>
              <CommentForm
                initialValue={comment.content}
                submitLabel="Salvar"
                onSubmit={async (content) => {
                  const err = await onEdit(comment.id, content)
                  if (!err) setIsEditing(false)
                  return err
                }}
                onCancel={() => setIsEditing(false)}
                autoFocus
              />
            </div>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.975rem',
                color: comment.is_deleted ? 'var(--text-faint)' : 'var(--text-muted)',
                lineHeight: 1.7,
                marginBottom: '0.5rem',
                fontStyle: comment.is_deleted ? 'italic' : 'normal',
              }}
            >
              {comment.content}
            </p>
          )}

          {/* Ações */}
          {!comment.is_deleted && !isEditing && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
              }}
            >
              {user && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    color: 'var(--text-faint)',
                    cursor: 'pointer',
                    padding: '0.25rem 0',
                    transition: 'color var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--emerald-light)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-faint)'
                  }}
                >
                  <CornerDownRight size={12} />
                  Responder
                </button>
              )}

              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    color: 'var(--text-faint)',
                    cursor: 'pointer',
                    padding: '0.25rem 0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--emerald-light)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-faint)'
                  }}
                >
                  <Pencil size={12} />
                  Editar
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Excluir este comentário?')) onDelete(comment.id)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    color: 'var(--text-faint)',
                    cursor: 'pointer',
                    padding: '0.25rem 0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#e57373'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-faint)'
                  }}
                >
                  <Trash2 size={12} />
                  {isAdmin && !isOwner ? 'Remover' : 'Excluir'}
                </button>
              )}
            </div>
          )}

          {/* Formulário de resposta */}
          {showReplyForm && (
            <div style={{ marginBottom: '1rem' }}>
              <CommentForm
                placeholder={`Respondendo ${comment.profile?.name || 'usuário'}…`}
                submitLabel="Responder"
                onSubmit={async (content) => {
                  const err = await onReply(comment.id, content)
                  if (!err) setShowReplyForm(false)
                  return err
                }}
                onCancel={() => setShowReplyForm(false)}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Toggle de respostas */}
      {hasReplies && (
        <div
          style={{
            marginLeft: `${indentPx + 20}px`,
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
          }}
        >
          <button
            onClick={() => setShowReplies(!showReplies)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              color: 'var(--emerald-light)',
              cursor: 'pointer',
              padding: '0.2rem 0',
            }}
          >
            {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showReplies ? 'Ocultar' : 'Ver'} {comment.replies.length}{' '}
            {comment.replies.length === 1 ? 'resposta' : 'respostas'}
          </button>
        </div>
      )}

      {/* Respostas aninhadas */}
      {showReplies && hasReplies && (
        <div
          style={{
            marginTop: '0.75rem',
            marginLeft: `${indentPx + 20}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            position: 'relative',
          }}
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

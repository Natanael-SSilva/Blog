'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<string | null>
  placeholder?: string
  initialValue?: string
  submitLabel?: string
  onCancel?: () => void
  autoFocus?: boolean
}

export default function CommentForm({
  onSubmit,
  placeholder = 'Escreva seu comentário…',
  initialValue = '',
  submitLabel = 'Comentar',
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const MAX = 2000

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    setLoading(true)
    const err = await onSubmit(content.trim())
    if (err) {
      setError(err)
      setLoading(false)
    } else {
      setContent('')
      setLoading(false)
    }
  }

  const remaining = MAX - content.length
  const isOverLimit = remaining < 0

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          transition: 'border-color var(--transition)',
          backgroundColor: 'var(--bg-surface-2)',
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = 'var(--emerald)'
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          required
          autoFocus={autoFocus}
          rows={3}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '0.875rem 1rem',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text)',
            lineHeight: 1.7,
            resize: 'vertical',
            minHeight: '80px',
          }}
        />

        {/* Rodapé do textarea */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.875rem',
            borderTop: '1px solid var(--border)',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              color: isOverLimit ? '#e57373' : 'var(--text-faint)',
            }}
          >
            {remaining < 200 ? `${remaining} caracteres restantes` : ''}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.78rem',
                  color: 'var(--text-faint)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                }}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading || isOverLimit || !content.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--emerald)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 1rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                color: 'var(--text)',
                cursor: loading || isOverLimit || !content.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || isOverLimit || !content.trim() ? 0.6 : 1,
                transition: 'all var(--transition)',
              }}
            >
              {loading ? <Loader2 size={13} /> : <Send size={13} />}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.8rem',
            color: '#e57373',
            marginTop: '0.5rem',
          }}
        >
          {error}
        </p>
      )}
    </form>
  )
}

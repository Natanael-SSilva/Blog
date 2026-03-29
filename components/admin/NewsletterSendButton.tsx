'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  posts: { id: string; title: string }[]
  confirmedCount: number
}

export default function NewsletterSendButton({ posts, confirmedCount }: Props) {
  const [selectedPostId, setSelectedPostId] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleSend() {
    if (!selectedPostId) {
      alert('Selecione um post para enviar.')
      return
    }

    const confirmed = window.confirm(
      `Enviar newsletter para ${confirmedCount} assinante${confirmedCount > 1 ? 's' : ''}?`
    )
    if (!confirmed) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: selectedPostId }),
      })

      const data = await res.json()

      setResult({
        message: res.ok ? data.message : data.error,
        type: res.ok ? 'success' : 'error',
      })
    } catch {
      setResult({ message: 'Erro de conexão. Tente novamente.', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Seletor de post */}
        <select
          value={selectedPostId}
          onChange={(e) => setSelectedPostId(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.875rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem',
            color: 'var(--text)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">Selecione o post…</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>

        {/* Botão enviar */}
        <button
          onClick={handleSend}
          disabled={sending || !selectedPostId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: selectedPostId ? 'var(--emerald)' : 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 1.25rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            color: selectedPostId ? 'var(--text)' : 'var(--text-faint)',
            cursor: sending || !selectedPostId ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? <Loader2 size={14} /> : <Send size={14} />}
          {sending
            ? 'Enviando…'
            : `Enviar para ${confirmedCount} assinante${confirmedCount > 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            backgroundColor:
              result.type === 'success' ? 'rgba(64,145,108,0.1)' : 'rgba(229,115,115,0.08)',
            border: `1px solid ${result.type === 'success' ? 'var(--emerald-deep)' : 'rgba(229,115,115,0.2)'}`,
            color: result.type === 'success' ? 'var(--emerald-light)' : '#e57373',
          }}
        >
          {result.type === 'success' && <CheckCircle2 size={14} />}
          {result.message}
        </div>
      )}
    </div>
  )
}

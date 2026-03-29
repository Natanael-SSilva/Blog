'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface NewsletterFormProps {
  compact?: boolean
}

export default function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Inscrição realizada! Verifique seu email.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Erro ao se inscrever. Tente novamente.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--emerald-light)',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
        }}
      >
        <CheckCircle2 size={16} />
        <span>{message}</span>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          Receba novos posts por email.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.75rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.9rem',
              color: 'var(--text)',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--emerald)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              backgroundColor: 'var(--emerald)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text)',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === 'loading' ? <Loader2 size={14} /> : <Mail size={14} />}
            Assinar
          </button>
        </div>
        {status === 'error' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#e57373',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-ui)',
              marginTop: '0.5rem',
            }}
          >
            <XCircle size={13} />
            {message}
          </div>
        )}
      </form>
    )
  }

  // Versão completa — no final dos posts
  return (
    <div
      className="newsletter-full"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.6rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '0.875rem',
        }}
      >
        ✦ Newsletter
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          color: 'var(--text)',
          marginBottom: '0.625rem',
        }}
      >
        Não perca nenhum post
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
          lineHeight: 1.7,
        }}
      >
        Receba novos textos diretamente no seu email. Sem spam, apenas histórias.
      </p>

      <form onSubmit={handleSubmit} className="newsletter-form-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.9rem',
            color: 'var(--text)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--emerald)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            backgroundColor: 'var(--gold)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1.5rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--bg)',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? <Loader2 size={15} /> : <Mail size={15} />}
          Assinar
        </button>
      </form>

      {status === 'error' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: '#e57373',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-ui)',
            marginTop: '1rem',
          }}
        >
          <XCircle size={14} />
          {message}
        </div>
      )}
    </div>
  )
}

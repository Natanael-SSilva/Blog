'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, X } from 'lucide-react'

const MESSAGES: Record<string, { text: string; type: 'success' | 'info' | 'error' }> = {
  confirmed: {
    text: 'Inscrição confirmada! Você receberá os próximos posts por email.',
    type: 'success',
  },
  already: { text: 'Este email já estava confirmado.', type: 'info' },
  unsubscribed: { text: 'Inscrição cancelada. Você não receberá mais emails.', type: 'info' },
  invalid: { text: 'Link inválido ou expirado.', type: 'error' },
  error: { text: 'Algo deu errado. Tente novamente.', type: 'error' },
}

export default function NewsletterToast() {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)

  useEffect(() => {
    const key = searchParams.get('newsletter')
    if (key && MESSAGES[key]) {
      setMsg(MESSAGES[key])
      setVisible(true)

      // Remove o parâmetro da URL sem recarregar
      const url = new URL(window.location.href)
      url.searchParams.delete('newsletter')
      // Usa window.history diretamente para evitar problema de tipo com router.replace
      window.history.replaceState({}, '', url.pathname + (url.search || ''))

      const timer = setTimeout(() => setVisible(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!visible || !msg) return null

  const isSuccess = msg.type === 'success'
  const isError = msg.type === 'error'

  return (
    <div
      className="newsletter-toast"
      style={{
        position: 'fixed',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${isSuccess ? 'var(--emerald)' : isError ? 'rgba(229,115,115,0.4)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'slideInToast 0.3s ease',
      }}
    >
      {isSuccess ? (
        <CheckCircle2 size={18} color="var(--emerald-light)" style={{ flexShrink: 0 }} />
      ) : isError ? (
        <XCircle size={18} color="#e57373" style={{ flexShrink: 0 }} />
      ) : (
        <CheckCircle2 size={18} color="var(--text-faint)" style={{ flexShrink: 0 }} />
      )}

      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          margin: 0,
          flex: 1,
        }}
      >
        {msg.text}
      </p>

      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-faint)',
          cursor: 'pointer',
          padding: '0.15rem',
          display: 'flex',
          flexShrink: 0,
        }}
        aria-label="Fechar"
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

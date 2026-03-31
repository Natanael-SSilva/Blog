'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { X, Loader2, Eye, EyeOff } from 'lucide-react'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const err =
      mode === 'login' ? await signIn(email, password) : await signUp(name, email, password)

    if (err) {
      setError(err)
      setLoading(false)
    } else {
      onClose()
    }
  }

  const inp: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.7rem 1rem',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9rem',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color var(--transition)',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Linha dourada */}
        <div
          style={{
            height: '2px',
            background:
              'linear-gradient(to right, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)',
          }}
        />

        <div style={{ padding: '1.75rem' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontWeight: 600,
              }}
            >
              {mode === 'login' ? 'Entrar para comentar' : 'Criar conta'}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                display: 'flex',
                padding: '0.25rem',
              }}
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
          >
            {mode === 'register' && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Seu nome"
                  style={inp}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--emerald)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginBottom: '0.35rem',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                style={inp}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--emerald)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginBottom: '0.35rem',
                }}
              >
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  style={{ ...inp, paddingRight: '2.75rem' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--emerald)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-faint)',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.82rem',
                  color: '#e57373',
                  backgroundColor: 'rgba(229,115,115,0.08)',
                  border: '1px solid rgba(229,115,115,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.875rem',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'var(--emerald)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.8rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1,
                marginTop: '0.25rem',
              }}
            >
              {loading && <Loader2 size={15} />}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {/* Alternar modo */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              color: 'var(--text-faint)',
              textAlign: 'center',
              marginTop: '1.25rem',
            }}
          >
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--emerald-light)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.8rem',
                padding: 0,
              }}
            >
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

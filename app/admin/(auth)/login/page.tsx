'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Feather, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
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

        <div style={{ padding: '2.5rem' }}>
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, var(--emerald-deep), var(--emerald))',
                borderRadius: '50%',
                border: '1px solid var(--gold-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather size={20} color="var(--gold-light)" strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--text)',
                  letterSpacing: '0.06em',
                }}
              >
                Painel Admin
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.78rem',
                  color: 'var(--text-faint)',
                  marginTop: '0.25rem',
                }}
              >
                Acesso restrito
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginBottom: '0.4rem',
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{
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
                }}
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
                htmlFor="password"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginBottom: '0.4rem',
                }}
              >
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.7rem 2.75rem 0.7rem 1rem',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                    outline: 'none',
                    transition: 'border-color var(--transition)',
                  }}
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
                    padding: '0.25rem',
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
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1,
                transition: 'background-color var(--transition)',
                marginTop: '0.5rem',
              }}
            >
              {loading && <Loader2 size={15} />}
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

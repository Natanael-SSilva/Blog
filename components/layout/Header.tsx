'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Feather } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(8, 14, 10, 0.95)' : 'var(--bg)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid var(--border)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {/* Linha dourada decorativa no topo */}
      <div
        style={{
          height: '2px',
          background:
            'linear-gradient(to right, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--page-max)',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Logo / Título */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, var(--emerald-deep), var(--emerald))',
              borderRadius: '50%',
              border: '1px solid var(--gold-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Feather size={16} color="var(--gold-light)" strokeWidth={1.5} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '0.08em',
                lineHeight: 1,
                display: 'block',
              }}
            >
              {process.env.NEXT_PUBLIC_SITE_NAME || 'É um Blog'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                color: 'var(--text-faint)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: '2px',
              }}
            >
              Resenhas e Opiniões
            </span>
          </div>
        </Link>

        {/* Navegação desktop */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          className="hidden-mobile"
        >
          <NavLink href="/">Início</NavLink>
          <NavLink href="/tags">Tags</NavLink>
          <NavLink href="/busca">Busca</NavLink>
          <span
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--border)',
              margin: '0 0.5rem',
            }}
          />
          <Link
            href="/admin/posts"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              padding: '0.4rem 0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--gold)'
              e.currentTarget.style.borderColor = 'var(--gold-deep)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-faint)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            Admin
          </Link>
        </nav>

        {/* Botão mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="show-mobile"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>
            Início
          </MobileNavLink>
          <MobileNavLink href="/tags" onClick={() => setMenuOpen(false)}>
            Tags
          </MobileNavLink>
          <MobileNavLink href="/busca" onClick={() => setMenuOpen(false)}>
            Busca
          </MobileNavLink>
          <MobileNavLink href="/admin/posts" onClick={() => setMenuOpen(false)}>
            Admin
          </MobileNavLink>
        </div>
      )}

      {/* CSS inline para responsividade */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        transition: 'all var(--transition)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--emerald-light)'
        e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-muted)'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '1rem',
        color: 'var(--text)',
        padding: '0.75rem 0',
        borderBottom: '1px solid var(--border)',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  )
}

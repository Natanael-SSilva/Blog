'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PostNavProps {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export default function PostNav({ prev, next }: PostNavProps) {
  const linkBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    transition: 'border-color var(--transition)',
  }

  return (
    <nav
      style={{
        display: 'grid',
        gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr',
        gap: '1rem',
        marginTop: '3rem',
      }}
    >
      {prev && (
        <Link
          href={`/post/${prev.slug}`}
          style={linkBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--emerald)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          <ChevronLeft size={18} color="var(--text-faint)" />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                marginBottom: '0.25rem',
              }}
            >
              Anterior
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                lineHeight: 1.3,
              }}
            >
              {prev.title}
            </div>
          </div>
        </Link>
      )}

      {next && (
        <Link
          href={`/post/${next.slug}`}
          style={{
            ...linkBase,
            justifyContent: 'flex-end',
            textAlign: 'right',
            gridColumn: prev ? undefined : '1 / -1',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--emerald)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                marginBottom: '0.25rem',
              }}
            >
              Próximo
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                lineHeight: 1.3,
              }}
            >
              {next.title}
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-faint)" />
        </Link>
      )}
    </nav>
  )
}

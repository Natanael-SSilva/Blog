'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PostNavProps {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export default function PostNav({ prev, next }: PostNavProps) {
  const both = prev && next

  return (
    <nav className={`post-nav ${both ? 'post-nav-both' : 'post-nav-single'}`}>
      {prev && (
        <Link
          href={`/post/${prev.slug}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            transition: 'border-color var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--emerald)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          <ChevronLeft size={16} color="var(--text-faint)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                marginBottom: '0.2rem',
              }}
            >
              Anterior
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            textAlign: 'right',
            transition: 'border-color var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--emerald)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                marginBottom: '0.2rem',
              }}
            >
              Próximo
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {next.title}
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-faint)" style={{ flexShrink: 0 }} />
        </Link>
      )}
    </nav>
  )
}

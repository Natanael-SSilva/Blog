'use client'

import Link from 'next/link'

interface TagItem {
  tag: string
  count: number
}

export default function SidebarTagLinks({ tags }: { tags: TagItem[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.6rem',
            textDecoration: 'none',
            transition: 'all var(--transition)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--emerald-light)'
            e.currentTarget.style.borderColor = 'var(--emerald)'
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
          }}
        >
          {tag}
          <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>
            {count}
          </span>
        </Link>
      ))}
    </div>
  )
}

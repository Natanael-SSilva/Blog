'use client'

import Link from 'next/link'

export default function PostTags({ tags }: { tags: string[] }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.72rem',
          color: 'var(--text-faint)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Tags:
      </span>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            color: 'var(--emerald-light)',
            border: '1px solid var(--emerald-deep)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.65rem',
            textDecoration: 'none',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--emerald-deep)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}

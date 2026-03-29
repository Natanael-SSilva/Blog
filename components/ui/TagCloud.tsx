'use client'

import Link from 'next/link'

interface TagItem {
  tag: string
  count: number
}

export default function TagCloud({ tags }: { tags: TagItem[] }) {
  const maxCount = Math.max(...tags.map((t) => t.count))
  const minCount = Math.min(...tags.map((t) => t.count))

  // Escala o tamanho da fonte entre 0.85rem e 1.8rem
  // baseado na contagem de posts de cada tag
  function getFontSize(count: number): string {
    if (maxCount === minCount) return '1.1rem'
    const scale = (count - minCount) / (maxCount - minCount)
    const min = 0.85
    const max = 1.8
    return `${(min + scale * (max - min)).toFixed(2)}rem`
  }

  // Opacity entre 0.6 e 1 proporcional à contagem
  function getOpacity(count: number): number {
    if (maxCount === minCount) return 0.8
    const scale = (count - minCount) / (maxCount - minCount)
    return Number((0.6 + scale * 0.4).toFixed(2))
  }

  return (
    <div
      className="tags-cloud"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: getFontSize(count),
            color: 'var(--emerald-light)',
            opacity: getOpacity(count),
            textDecoration: 'none',
            transition: 'all var(--transition)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontStyle: 'italic',
            lineHeight: 1.2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--gold-light)'
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--emerald-light)'
            e.currentTarget.style.opacity = String(getOpacity(count))
          }}
          title={`${count} post${count > 1 ? 's' : ''}`}
        >
          {tag}
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.65rem',
              fontStyle: 'normal',
              color: 'var(--text-faint)',
              verticalAlign: 'super',
            }}
          >
            {count}
          </span>
        </Link>
      ))}
    </div>
  )
}

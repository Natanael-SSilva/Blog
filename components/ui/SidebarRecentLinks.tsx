'use client'

import Link from 'next/link'

interface RecentPost {
  slug: string
  title: string
  date: string
}

export default function SidebarRecentLinks({ posts }: { posts: RecentPost[] }) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/post/${post.slug}`}
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
              transition: 'color var(--transition)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--emerald-light)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {post.title}
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              color: 'var(--text-faint)',
              display: 'block',
              marginTop: '2px',
            }}
          >
            {post.date}
          </span>
        </li>
      ))}
    </ul>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag } from 'lucide-react'
import { Post } from '@/types'
import { formatDate, getReadingTime } from '@/lib/utils'

interface PostCardProps {
  post: Post
  index?: number
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const readingTime = getReadingTime(post.content)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all var(--transition-slow)',
        position: 'relative',
      }}
      whileHover={{
        borderColor: 'var(--emerald)',
        boxShadow: '0 0 0 1px var(--emerald), 0 8px 32px rgba(0,0,0,0.4)',
        y: -2,
      }}
    >
      <div
        style={{
          height: '2px',
          background:
            'linear-gradient(to right, var(--emerald-deep), var(--emerald-mid), transparent)',
          opacity: 0.6,
        }}
      />

      {post.cover_image && (
        <Link href={`/post/${post.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
          <div className="post-card-image" style={{ position: 'relative' }}>
            <Image src={post.cover_image} alt={post.title} fill style={{ objectFit: 'cover' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--bg-surface) 0%, transparent 60%)',
              }}
            />
          </div>
        </Link>
      )}

      <div className="post-card-body">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.625rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              color: 'var(--text-faint)',
            }}
          >
            <Calendar size={10} />
            {formatDate(post.created_at)}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              color: 'var(--text-faint)',
            }}
          >
            <Clock size={10} />
            {readingTime}
          </span>
          {post.mood_emoji && (
            <span style={{ fontSize: '0.8rem' }} title={post.mood || ''}>
              {post.mood_emoji}
            </span>
          )}
        </div>

        <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--text)',
              lineHeight: 1.3,
              marginBottom: '0.625rem',
              transition: 'color var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--gold-light)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text)'
            }}
          >
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.975rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {post.tags.length > 0 && (
            <div
              style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <Tag size={10} color="var(--text-faint)" />
              {post.tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="tag-link"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em',
                    color: 'var(--emerald-light)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--emerald-deep)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.15rem 0.45rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <Link
            href={`/post/${post.slug}`}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Ler mais →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

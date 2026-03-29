'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Pin, Calendar, Clock } from 'lucide-react'
import { Post } from '@/types'
import { formatDate, getReadingTime } from '@/lib/utils'

export default function FeaturedPost({ post }: { post: Post }) {
  const readingTime = getReadingTime(post.content)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--gold-deep)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 0 40px rgba(201,168,76,0.06)',
      }}
    >
      {/* Badge fixado */}
      <div
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--gold-deep)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.25rem 0.5rem',
        }}
      >
        <Pin size={10} color="var(--gold)" />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Destaque
        </span>
      </div>

      <div
        style={{
          height: '3px',
          background:
            'linear-gradient(to right, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)',
        }}
      />

      {post.cover_image && (
        <Link href={`/post/${post.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
          <div className="featured-cover" style={{ position: 'relative' }}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, var(--bg-surface) 0%, rgba(8,14,10,0.3) 60%, transparent 100%)',
              }}
            />
          </div>
        </Link>
      )}

      <div className="featured-body">
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.625rem',
            opacity: 0.8,
          }}
        >
          ✦ Última publicação
        </div>

        <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2
            className="featured-title"
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

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              color: 'var(--text-faint)',
            }}
          >
            <Calendar size={11} />
            {formatDate(post.created_at)}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              color: 'var(--text-faint)',
            }}
          >
            <Clock size={11} />
            {readingTime}
          </span>
          {post.mood_emoji && (
            <span style={{ fontSize: '0.9rem' }} title={post.mood || ''}>
              {post.mood_emoji} {post.mood}
            </span>
          )}
        </div>

        {post.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.75,
              marginBottom: '1.25rem',
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="featured-footer">
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="tag-link"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.06em',
                  color: 'var(--emerald-light)',
                  border: '1px solid var(--emerald-deep)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.2rem 0.5rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {tag}
              </Link>
            ))}
          </div>

          <Link
            href={`/post/${post.slug}`}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--bg)',
              backgroundColor: 'var(--gold)',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Ler agora
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

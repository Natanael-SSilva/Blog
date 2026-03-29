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
        marginBottom: '2.5rem',
        boxShadow: '0 0 40px rgba(201,168,76,0.06)',
      }}
    >
      {/* Badge fixado */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--gold-deep)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.3rem 0.65rem',
        }}
      >
        <Pin size={11} color="var(--gold)" />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Destaque
        </span>
      </div>

      {/* Linha dourada no topo */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(to right, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Imagem de capa */}
        {post.cover_image && (
          <Link href={`/post/${post.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '260px' }}>
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
                  background: 'linear-gradient(to top, var(--bg-surface) 0%, rgba(8,14,10,0.3) 60%, transparent 100%)',
                }}
              />
            </div>
          </Link>
        )}

        <div style={{ padding: '2rem' }}>
          {/* Ornamento */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '0.75rem',
              opacity: 0.8,
            }}
          >
            ✦ Última publicação
          </div>

          {/* Título */}
          <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.9rem',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.25,
                marginBottom: '1rem',
                letterSpacing: '0.01em',
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

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
              }}
            >
              <Calendar size={12} />
              {formatDate(post.created_at)}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
              }}
            >
              <Clock size={12} />
              {readingTime}
            </span>
            {post.mood_emoji && (
              <span style={{ fontSize: '1rem' }} title={post.mood || ''}>
                {post.mood_emoji} {post.mood}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags e CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    color: 'var(--emerald-light)',
                    border: '1px solid var(--emerald-deep)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.2rem 0.6rem',
                    textDecoration: 'none',
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
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--bg)',
                backgroundColor: 'var(--gold)',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                transition: 'background-color var(--transition)',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gold-light)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gold)'
              }}
            >
              Ler agora
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

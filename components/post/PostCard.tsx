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
        boxShadow: '0 0 0 1px var(--emerald), 0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(45,106,79,0.12)',
        y: -2,
      }}
    >
      {/* Linha decorativa no topo */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(to right, var(--emerald-deep), var(--emerald-mid), transparent)',
          opacity: 0.6,
        }}
      />

      {/* Imagem de capa */}
      {post.cover_image && (
        <Link href={`/post/${post.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '200px' }}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            />
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

      <div style={{ padding: '1.5rem' }}>
        {/* Meta — data e tempo de leitura */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.75rem',
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
              letterSpacing: '0.05em',
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
              letterSpacing: '0.05em',
            }}
          >
            <Clock size={11} />
            {readingTime}
          </span>
          {post.mood_emoji && (
            <span style={{ fontSize: '0.85rem' }} title={post.mood || ''}>
              {post.mood_emoji}
            </span>
          )}
        </div>

        {/* Título */}
        <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 600,
              color: 'var(--text)',
              lineHeight: 1.3,
              marginBottom: '0.75rem',
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

        {/* Excerpt */}
        {post.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Rodapé — tags e link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tag size={11} color="var(--text-faint)" />
              {post.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.06em',
                    color: 'var(--emerald-light)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--emerald-deep)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.15rem 0.5rem',
                    textDecoration: 'none',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--emerald-deep)'
                    e.currentTarget.style.color = 'var(--emerald-pale)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
                    e.currentTarget.style.color = 'var(--emerald-light)'
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Ler mais */}
          <Link
            href={`/post/${post.slug}`}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              textDecoration: 'none',
              transition: 'color var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--gold-light)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--gold)'
            }}
          >
            Ler mais →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

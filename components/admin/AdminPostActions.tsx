'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Post } from '@/types'
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Loader2,
  MessageSquare,
  MessageSquareOff,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPostActions({ post }: { post: Post }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function togglePublished() {
    setLoading('publish')
    const supabase = createClient()
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id)
    router.refresh()
    setLoading(null)
  }

  async function toggleFeatured() {
    setLoading('feature')
    const supabase = createClient()

    // Remove featured de qualquer outro post primeiro
    if (!post.is_featured) {
      await supabase.from('posts').update({ is_featured: false }).eq('is_featured', true)
    }

    await supabase.from('posts').update({ is_featured: !post.is_featured }).eq('id', post.id)

    router.refresh()
    setLoading(null)
  }

  async function toggleComments() {
    setLoading('comments')
    await fetch(`/api/posts/${post.id}/comments-toggle`, { method: 'PATCH' })
    router.refresh()
    setLoading(null)
  }

  async function deletePost() {
    if (!confirm(`Deletar "${post.title}"? Esta ação não pode ser desfeita.`)) return
    setLoading('delete')
    const supabase = createClient()
    await supabase.from('posts').delete().eq('id', post.id)
    router.refresh()
    setLoading(null)
  }

  const btnStyle = {
    background: 'none',
    border: 'none',
    padding: '0.35rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition)',
    color: 'var(--text-faint)',
  } as React.CSSProperties

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
      {/* Editar */}
      <Link
        href={`/admin/posts/${post.id}/editar`}
        title="Editar"
        style={{ ...btnStyle, textDecoration: 'none' }}
      >
        <Pencil size={13} />
      </Link>

      {/* Publicar/Despublicar */}
      <button
        onClick={togglePublished}
        title={post.published ? 'Despublicar' : 'Publicar'}
        style={btnStyle}
        disabled={loading === 'publish'}
      >
        {loading === 'publish' ? (
          <Loader2 size={13} />
        ) : post.published ? (
          <EyeOff size={13} />
        ) : (
          <Eye size={13} color="var(--emerald-light)" />
        )}
      </button>

      {/* Fixar/Desfixar */}
      <button
        onClick={toggleFeatured}
        title={post.is_featured ? 'Remover destaque' : 'Fixar no topo'}
        style={btnStyle}
        disabled={loading === 'feature'}
      >
        {loading === 'feature' ? (
          <Loader2 size={13} />
        ) : post.is_featured ? (
          <PinOff size={13} />
        ) : (
          <Pin size={13} color="var(--gold)" />
        )}
      </button>

      {/* Comentários */}
      <button
        onClick={toggleComments}
        title={
          (post as { comments_enabled?: boolean }).comments_enabled !== false
            ? 'Desativar comentários'
            : 'Ativar comentários'
        }
        style={btnStyle}
        disabled={loading === 'comments'}
      >
        {loading === 'comments' ? (
          <Loader2 size={13} />
        ) : (post as { comments_enabled?: boolean }).comments_enabled !== false ? (
          <MessageSquare size={13} color="var(--emerald-light)" />
        ) : (
          <MessageSquareOff size={13} color="var(--text-faint)" />
        )}
      </button>

      {/* Deletar */}
      <button onClick={deletePost} title="Deletar" style={btnStyle} disabled={loading === 'delete'}>
        {loading === 'delete' ? <Loader2 size={13} /> : <Trash2 size={13} color="#e57373" />}
      </button>
    </div>
  )
}

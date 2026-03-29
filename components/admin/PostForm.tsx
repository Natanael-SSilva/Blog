'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Post, MOODS } from '@/types'
import { generateSlug, generateExcerpt } from '@/lib/utils'
import TiptapEditor from './TiptapEditor'
import { Save, Eye, X, Loader2, ImageIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PostFormProps {
  post?: Post
}

export default function PostForm({ post }: PostFormProps) {
  const isEditing = !!post
  const router = useRouter()

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugManual, setSlugManual] = useState(isEditing)
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState<Record<string, unknown>>(post?.content || {})
  const [tags, setTags] = useState(post?.tags.join(', ') || '')
  const [mood, setMood] = useState(post?.mood || '')
  const [moodEmoji, setMoodEmoji] = useState(post?.mood_emoji || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [published, setPublished] = useState(post?.published || false)
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  // Auto-gerar slug a partir do título
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugManual])

  // Auto-save a cada 30s (apenas rascunhos)
  const autoSave = useCallback(async () => {
    if (!isEditing || published) return
    await handleSave(false, true)
  }, [content, title, excerpt, tags]) // eslint-disable-line

  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
    const timer = setTimeout(autoSave, 30000)
    setAutoSaveTimer(timer)
    return () => clearTimeout(timer)
  }, [content, title]) // eslint-disable-line

  async function handleUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()

    const ext = file.name.split('.').pop()
    const fileName = `covers/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('blog-media')
      .upload(fileName, file, { upsert: true })

    if (!error && data) {
      const { data: urlData } = supabase.storage.from('blog-media').getPublicUrl(data.path)
      setCoverImage(urlData.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave(publishNow?: boolean, silent = false) {
    if (!title.trim()) {
      alert('O título é obrigatório.')
      return
    }

    if (!silent) setSaving(true)

    const supabase = createClient()

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    const excerptFinal = excerpt.trim() || generateExcerpt(content)

    const payload = {
      title: title.trim(),
      slug: slug || generateSlug(title),
      content,
      excerpt: excerptFinal,
      cover_image: coverImage || null,
      mood: mood || null,
      mood_emoji: moodEmoji || null,
      is_featured: isFeatured,
      tags: tagsArray,
      published: publishNow !== undefined ? publishNow : published,
    }

    let error

    if (isEditing) {
      const res = await supabase.from('posts').update(payload).eq('id', post.id)
      error = res.error
    } else {
      const res = await supabase.from('posts').insert(payload).select().single()
      error = res.error
      if (!error && res.data) {
        router.push(`/admin/posts/${res.data.id}/editar`)
      }
    }

    if (!silent) {
      setSaving(false)
      if (error) {
        setSaveStatus('error')
        console.error(error)
      } else {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 3000)
        if (publishNow !== undefined) {
          setPublished(publishNow)
          router.refresh()
        }
      }
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.65rem 0.875rem',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9rem',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color var(--transition)',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
    marginBottom: '0.4rem',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '2rem',
        alignItems: 'flex-start',
      }}
    >
      {/* Coluna principal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
        {/* Título */}
        <div>
          <label style={labelStyle}>Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do post"
            style={{ ...inputStyle, fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--emerald)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle}>Slug (URL)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                color: 'var(--text-faint)',
                whiteSpace: 'nowrap',
              }}
            >
              /post/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugManual(true)
              }}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--emerald)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            />
          </div>
        </div>

        {/* Editor */}
        <div>
          <label style={labelStyle}>Conteúdo *</label>
          <TiptapEditor content={content} onChange={setContent} placeholder="Escreva aqui…" />
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Resumo (excerpt)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Deixe em branco para gerar automaticamente do conteúdo"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--emerald)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
        </div>
      </div>

      {/* Coluna lateral */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          position: 'sticky',
          top: '2rem',
        }}
      >
        {/* Ações */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {saveStatus === 'saved' && (
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--emerald-light)',
                textAlign: 'center',
              }}
            >
              ✓ Salvo
            </p>
          )}
          {saveStatus === 'error' && (
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: '#e57373',
                textAlign: 'center',
              }}
            >
              Erro ao salvar
            </p>
          )}

          {/* Rascunho */}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition)',
            }}
          >
            {saving ? <Loader2 size={13} /> : <Save size={13} />}
            Salvar rascunho
          </button>

          {/* Publicar */}
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            style={{
              width: '100%',
              backgroundColor: published ? 'var(--bg-surface-2)' : 'var(--gold)',
              border: `1px solid ${published ? 'var(--emerald-deep)' : 'transparent'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: published ? 'var(--emerald-light)' : 'var(--bg)',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              transition: 'all var(--transition)',
            }}
          >
            {saving ? <Loader2 size={13} /> : <Eye size={13} />}
            {published ? '✓ Publicado' : 'Publicar'}
          </button>

          {/* Despublicar se publicado */}
          {published && (
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.72rem',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              Voltar para rascunho
            </button>
          )}

          {/* Preview — só aparece em posts já salvos */}
          {isEditing && (
            <Link
              href={`/admin/posts/${post.id}/preview`}
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
                textDecoration: 'none',
                padding: '0.4rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                transition: 'all var(--transition)',
              }}
            >
              <ExternalLink size={12} />
              Abrir preview
            </Link>
          )}
        </div>

        {/* Imagem de capa */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Imagem de Capa</label>

          {coverImage ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  height: '140px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                }}
              >
                <Image src={coverImage} alt="Capa" fill style={{ objectFit: 'cover' }} />
              </div>
              <button
                type="button"
                onClick={() => setCoverImage('')}
                style={{
                  position: 'absolute',
                  top: '0.4rem',
                  right: '0.4rem',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                height: '100px',
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                backgroundColor: 'var(--bg-surface-2)',
              }}
            >
              {uploading ? (
                <Loader2 size={20} color="var(--text-faint)" />
              ) : (
                <>
                  <ImageIcon size={20} color="var(--text-faint)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.75rem',
                      color: 'var(--text-faint)',
                    }}
                  >
                    Clique para enviar
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadCover}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>

        {/* Mood */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Humor (Mood)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => {
                  if (mood === m.value) {
                    setMood('')
                    setMoodEmoji('')
                  } else {
                    setMood(m.label)
                    setMoodEmoji(m.emoji)
                  }
                }}
                title={m.label}
                style={{
                  background: 'none',
                  border: `1px solid ${mood === m.value ? 'var(--emerald)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all var(--transition)',
                  backgroundColor: mood === m.value ? 'var(--emerald-deep)' : 'var(--bg-surface-2)',
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          {mood && (
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
                marginTop: '0.5rem',
              }}
            >
              {moodEmoji} {mood}
            </p>
          )}
        </div>

        {/* Tags */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <label style={labelStyle}>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="fantasia, escrita, vida"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--emerald)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.68rem',
              color: 'var(--text-faint)',
              marginTop: '0.4rem',
            }}
          >
            Separe por vírgulas
          </p>
        </div>

        {/* Opções */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <label style={{ ...labelStyle, marginBottom: 0 }}>Opções</label>

          <label
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              Fixar no topo (destaque)
            </span>
          </label>
        </div>
      </div>

      {/* Responsividade */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

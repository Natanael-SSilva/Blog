import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import slugifyLib from 'slugify'
import readingTime from 'reading-time'

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })
}

export function formatDateShort(dateString: string): string {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDateRelative(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ptBR,
  })
}

export function generateSlug(title: string): string {
  return slugifyLib(title, {
    lower: true,
    strict: true,
    locale: 'pt',
    trim: true,
  })
}

export function getReadingTime(content: Record<string, unknown>): string {
  const text = extractTextFromTiptap(content)
  const stats = readingTime(text)
  const minutes = Math.ceil(stats.minutes)
  return minutes <= 1 ? '1 min de leitura' : `${minutes} min de leitura`
}

function extractTextFromTiptap(node: Record<string, unknown>): string {
  if (!node) return ''

  if (node.type === 'text') {
    return (node.text as string) || ''
  }

  if (Array.isArray(node.content)) {
    return (node.content as Record<string, unknown>[]).map(extractTextFromTiptap).join(' ')
  }

  return ''
}

export function generateExcerpt(content: Record<string, unknown>, maxLength = 160): string {
  const text = extractTextFromTiptap(content)
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function getPostUrl(slug: string): string {
  return `/post/${slug}`
}

export function getTagUrl(tag: string): string {
  return `/tag/${encodeURIComponent(tag)}`
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${base}${path}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}


export interface Post {
  id: string
  slug: string
  title: string
  content: Record<string, unknown> // Tiptap JSON
  excerpt: string | null
  cover_image: string | null
  mood: string | null
  mood_emoji: string | null
  is_featured: boolean
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  confirmed: boolean
  token: string
  subscribed_at: string
  unsubscribed_at: string | null
}


export type CreatePostDTO = Omit<Post, 'id' | 'created_at' | 'updated_at'>
export type UpdatePostDTO = Partial<CreatePostDTO>


export interface Mood {
  label: string
  emoji: string
  value: string
}

export const MOODS: Mood[] = [
  { label: 'Animado', emoji: '😄', value: 'animado' },
  { label: 'Pensativo', emoji: '🤔', value: 'pensativo' },
  { label: 'Inspirado', emoji: '✨', value: 'inspirado' },
  { label: 'Misterioso', emoji: '🌑', value: 'misterioso' },
  { label: 'Feliz', emoji: '😊', value: 'feliz' },
  { label: 'Cansado', emoji: '😴', value: 'cansado' },
  { label: 'Empolgado', emoji: '🔥', value: 'empolgado' },
  { label: 'Melancólico', emoji: '🌧️', value: 'melancolico' },
  { label: 'Criativo', emoji: '🎨', value: 'criativo' },
  { label: 'Épico', emoji: '⚔️', value: 'epico' },
]

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

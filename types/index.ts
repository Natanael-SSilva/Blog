// ============================================================
// MODELOS DE DADOS — espelham as tabelas do Supabase
// ============================================================

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
  comments_enabled: boolean
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

// ============================================================
// DTOs — dados usados em formulários e criação
// ============================================================

export type CreatePostDTO = Omit<Post, 'id' | 'created_at' | 'updated_at'>
export type UpdatePostDTO = Partial<CreatePostDTO>

// ============================================================
// MOODS — lista de humores disponíveis
// ============================================================

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

// ============================================================
// PAGINAÇÃO
// ============================================================

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ============================================================
// RESPOSTAS DE API
// ============================================================

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================
// COMENTÁRIOS
// ============================================================

export interface Profile {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  is_deleted: boolean
  created_at: string
  updated_at: string
  profile?: Profile
  replies?: Comment[]
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
}

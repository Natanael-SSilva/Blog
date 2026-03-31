import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { containsBlockedContent, getBlockedReason } from '@/lib/content-filter'

interface CommentRow {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  is_deleted: boolean
  created_at: string
  updated_at: string
  profile: { id: string; name: string; is_admin: boolean } | null
  replies?: CommentRow[]
}

// GET /api/comments?postId=xxx
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')
  if (!postId) {
    return NextResponse.json({ error: 'postId é obrigatório.' }, { status: 400 })
  }

  // GET usa service role para garantir leitura sem problemas de RLS
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('comments')
    .select(
      `
      id, post_id, user_id, parent_id, content,
      is_deleted, created_at, updated_at,
      profile:profiles(id, name, is_admin)
    `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('GET comments error:', error.message)
    return NextResponse.json({ error: 'Erro ao buscar comentários.' }, { status: 500 })
  }

  const tree = buildTree((data as unknown as CommentRow[]) || [])
  return NextResponse.json({ comments: tree })
}

// POST /api/comments
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Auth error:', authError?.message)
    return NextResponse.json({ error: 'Você precisa estar logado para comentar.' }, { status: 401 })
  }

  try {
    const { postId, parentId, content } = await request.json()

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: 'Post e conteúdo são obrigatórios.' }, { status: 400 })
    }

    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comentário muito longo.' }, { status: 400 })
    }

    // Usa service role para verificar o post e inserir o comentário
    // evita problemas de RLS com o cliente do servidor
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: post } = await adminSupabase
      .from('posts')
      .select('id, comments_enabled')
      .eq('id', postId)
      .eq('published', true)
      .single()

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 })
    }

    if (!post.comments_enabled) {
      return NextResponse.json({ error: 'Comentários desativados neste post.' }, { status: 403 })
    }

    if (containsBlockedContent(content)) {
      return NextResponse.json({ error: getBlockedReason(content) }, { status: 422 })
    }

    const { data: comment, error: insertError } = await adminSupabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        parent_id: parentId || null,
        content: content.trim(),
      })
      .select(
        `
        id, post_id, user_id, parent_id, content,
        is_deleted, created_at, updated_at,
        profile:profiles(id, name, is_admin)
      `
      )
      .single()

    if (insertError) {
      console.error('Insert comment error:', insertError.message)
      return NextResponse.json({ error: 'Erro ao salvar comentário.' }, { status: 500 })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (err) {
    console.error('Comment POST catch:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

function buildTree(comments: CommentRow[]): CommentRow[] {
  const map: Record<string, CommentRow & { replies: CommentRow[] }> = {}
  const roots: (CommentRow & { replies: CommentRow[] })[] = []

  comments.forEach((c) => {
    map[c.id] = { ...c, replies: [] }
  })
  comments.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })

  return roots
}

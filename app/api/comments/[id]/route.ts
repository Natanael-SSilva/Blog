import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { containsBlockedContent, getBlockedReason } from '@/lib/content-filter'

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH /api/comments/[id] — editar conteúdo
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const { content } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Conteúdo não pode estar vazio.' }, { status: 400 })
  }

  if (content.trim().length > 2000) {
    return NextResponse.json({ error: 'Comentário muito longo.' }, { status: 400 })
  }

  if (containsBlockedContent(content)) {
    return NextResponse.json({ error: getBlockedReason(content) }, { status: 422 })
  }

  // RLS garante que só o dono pode editar
  const { data, error } = await supabase
    .from('comments')
    .update({ content: content.trim() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select(
      `
      id, post_id, user_id, parent_id, content,
      is_deleted, created_at, updated_at,
      profile:profiles(id, name, is_admin)
    `
    )
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Comentário não encontrado ou sem permissão.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ comment: data })
}

// DELETE /api/comments/[id] — soft delete (mantém estrutura da thread)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // Verifica se é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.is_admin === true

  // Admin pode deletar qualquer um; usuário só o próprio
  const query = supabase
    .from('comments')
    .update({ is_deleted: true, content: '[comentário removido]' })
    .eq('id', id)

  if (!isAdmin) {
    query.eq('user_id', user.id)
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: 'Erro ao excluir comentário.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

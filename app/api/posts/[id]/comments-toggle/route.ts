import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH /api/posts/[id]/comments-toggle
// Ativa ou desativa comentários em um post (apenas admin)
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
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

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Apenas o admin pode fazer isso.' }, { status: 403 })
  }

  // Busca estado atual e inverte
  const { data: post } = await supabase
    .from('posts')
    .select('comments_enabled')
    .eq('id', id)
    .single()

  if (!post) {
    return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 })
  }

  const { data: updated, error } = await supabase
    .from('posts')
    .update({ comments_enabled: !post.comments_enabled })
    .eq('id', id)
    .select('comments_enabled')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
  }

  return NextResponse.json({ comments_enabled: updated.comments_enabled })
}

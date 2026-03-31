import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios.' }, { status: 400 })
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: 'Nome muito curto.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // confirma automaticamente sem email
      user_metadata: { name: name.trim() },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json({ error: 'Este email já está cadastrado.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Erro ao criar conta. Tente novamente.' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Conta criada! Você já pode comentar.',
      userId: data.user.id,
    })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

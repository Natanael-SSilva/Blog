import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL, SITE_URL, SITE_NAME } from '@/lib/resend'
import { confirmEmailTemplate } from '@/lib/email-templates'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verifica se já existe
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmed, unsubscribed_at')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.confirmed && !existing.unsubscribed_at) {
        return NextResponse.json({ error: 'Este email já está inscrito.' }, { status: 409 })
      }
      // Reinscrevendo quem cancelou
      await supabase
        .from('newsletter_subscribers')
        .update({ unsubscribed_at: null, confirmed: false })
        .eq('id', existing.id)
    } else {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email })
      if (error) {
        return NextResponse.json({ error: 'Erro ao salvar inscrição.' }, { status: 500 })
      }
    }

    // Busca o token gerado para montar o link de confirmação
    const { data: subscriber } = await supabase
      .from('newsletter_subscribers')
      .select('token')
      .eq('email', email)
      .single()

    if (subscriber?.token) {
      const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${subscriber.token}`
      const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${subscriber.token}`

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Confirme sua inscrição — ${SITE_NAME}`,
        html: confirmEmailTemplate({ confirmUrl, siteName: SITE_NAME, unsubscribeUrl }),
      })
    }

    return NextResponse.json(
      { message: 'Quase lá! Verifique seu email para confirmar a inscrição.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL, SITE_URL, SITE_NAME } from '@/lib/resend'
import { newPostEmailTemplate } from '@/lib/email-templates'

interface Subscriber {
  email: string
  token: string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'postId é obrigatório.' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    const { data: post, error: postError } = await adminSupabase
      .from('posts')
      .select('title, slug, excerpt')
      .eq('id', postId)
      .eq('published', true)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 })
    }

    const { data: subscribers } = await adminSupabase
      .from('newsletter_subscribers')
      .select('email, token')
      .eq('confirmed', true)
      .is('unsubscribed_at', null)

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'Nenhum assinante confirmado.', sent: 0 })
    }

    const postUrl = `${SITE_URL}/post/${post.slug}`
    const BATCH_SIZE = 50
    let sent = 0

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map((sub: Subscriber) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: sub.email,
            subject: post.title,
            html: newPostEmailTemplate({
              postTitle: post.title,
              postExcerpt: post.excerpt || '',
              postUrl,
              siteName: SITE_NAME,
              unsubscribeUrl: `${SITE_URL}/api/newsletter/unsubscribe?token=${sub.token}`,
            }),
          })
        )
      )

      sent += batch.length
    }

    return NextResponse.json({
      message: `Newsletter enviada para ${sent} assinante${sent > 1 ? 's' : ''}.`,
      sent,
    })
  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json({ error: 'Erro ao enviar newsletter.' }, { status: 500 })
  }
}
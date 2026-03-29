import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?newsletter=invalid', request.url))
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('token', token)
    .is('unsubscribed_at', null)

  if (error) {
    return NextResponse.redirect(new URL('/?newsletter=error', request.url))
  }

  return NextResponse.redirect(new URL('/?newsletter=unsubscribed', request.url))
}

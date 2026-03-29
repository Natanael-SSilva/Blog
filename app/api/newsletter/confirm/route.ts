import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?newsletter=invalid', request.url))
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ confirmed: true })
    .eq('token', token)
    .eq('confirmed', false)
    .select()
    .single()

  if (error || !data) {
    // Token inválido ou já confirmado
    return NextResponse.redirect(new URL('/?newsletter=already', request.url))
  }

  return NextResponse.redirect(new URL('/?newsletter=confirmed', request.url))
}

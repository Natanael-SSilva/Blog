import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { Subscriber, Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { Users, CheckCircle2, XCircle } from 'lucide-react'
import NewsletterSendButton from '@/components/admin/NewsletterSendButton'

async function getSubscribers(): Promise<Subscriber[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })
  return (data as Subscriber[]) || []
}

async function getPublishedPosts(): Promise<Pick<Post, 'id' | 'title'>[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('id, title')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)
  return (data as Pick<Post, 'id' | 'title'>[]) || []
}

export default async function AdminNewsletterPage() {
  const [subscribers, posts] = await Promise.all([getSubscribers(), getPublishedPosts()])

  const confirmed = subscribers.filter((s) => s.confirmed && !s.unsubscribed_at).length
  const pending = subscribers.filter((s) => !s.confirmed && !s.unsubscribed_at).length
  const unsubscribed = subscribers.filter((s) => !!s.unsubscribed_at).length

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--text)',
            marginBottom: '0.4rem',
          }}
        >
          Newsletter
        </h1>
        <p
          style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-faint)' }}
        >
          Gerencie assinantes e dispare campanhas
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { label: 'Confirmados', value: confirmed, color: 'var(--emerald-light)' },
          { label: 'Pendentes', value: pending, color: 'var(--gold)' },
          { label: 'Cancelaram', value: unsubscribed, color: 'var(--text-faint)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color,
                lineHeight: 1,
                marginBottom: '0.4rem',
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Disparar campanha */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--text)',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
          }}
        >
          Disparar campanha
        </h2>
        {confirmed === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.82rem',
              color: 'var(--text-faint)',
            }}
          >
            Nenhum assinante confirmado ainda.
          </p>
        ) : (
          <NewsletterSendButton posts={posts} confirmedCount={confirmed} />
        )}
      </div>

      {/* Lista de assinantes */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface-2)',
          }}
        >
          <Users size={14} color="var(--gold)" />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Assinantes ({subscribers.length})
          </span>
        </div>

        {subscribers.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--text-faint)',
              fontStyle: 'italic',
            }}
          >
            Nenhum assinante ainda.
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 140px',
                padding: '0.625rem 1.25rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {['Email', 'Status', 'Data'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {subscribers.map((sub) => {
              const isActive = sub.confirmed && !sub.unsubscribed_at
              const isCancelled = !!sub.unsubscribed_at
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 140px',
                    padding: '0.875rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center',
                    opacity: isCancelled ? 0.5 : 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {sub.email}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.72rem',
                      color: isActive
                        ? 'var(--emerald-light)'
                        : isCancelled
                          ? 'var(--text-faint)'
                          : 'var(--gold)',
                    }}
                  >
                    {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {isActive ? 'Ativo' : isCancelled ? 'Cancelou' : 'Pendente'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.72rem',
                      color: 'var(--text-faint)',
                    }}
                  >
                    {formatDate(sub.subscribed_at)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

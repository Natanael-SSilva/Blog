import { createClient } from '@/lib/supabase/server'
import { Tag, BookOpen, Mail } from 'lucide-react'
import NewsletterForm from '@/components/ui/NewsletterForm'
import { formatDate } from '@/lib/utils'
import { Post } from '@/types'
import SidebarRecentLinks from '@/components/ui/SidebarRecentLinks'
import SidebarTagLinks from '@/components/ui/SidebarTagLinks'

async function getRecentPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('id, slug, title, created_at, tags')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(5)
  return (data as Post[]) || []
}

async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('tags').eq('published', true)

  if (!data) return []

  const tagCount: Record<string, number> = {}
  data.forEach((post: { tags: string[] }) => {
    post.tags?.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export default async function Sidebar() {
  const [recentPosts, tags] = await Promise.all([getRecentPosts(), getAllTags()])

  const recentItems = recentPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: formatDate(p.created_at),
  }))

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Newsletter */}
      <SidebarSection icon={<Mail size={14} />} title="Receba os posts">
        <NewsletterForm compact />
      </SidebarSection>

      {/* Posts Recentes */}
      {recentItems.length > 0 && (
        <SidebarSection icon={<BookOpen size={14} />} title="Recentes">
          <SidebarRecentLinks posts={recentItems} />
        </SidebarSection>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <SidebarSection icon={<Tag size={14} />} title="Tags">
          <SidebarTagLinks tags={tags} />
        </SidebarSection>
      )}

      {/* Divisor ornamental */}
      <div className="ornament-divider">
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            fontFamily: 'var(--font-ui)',
            color: 'var(--gold)',
          }}
        >
          ✦
        </span>
      </div>
    </aside>
  )
}

function SidebarSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(to right, var(--bg-surface-2), var(--bg-surface))',
        }}
      >
        <span style={{ color: 'var(--gold)', display: 'flex' }}>{icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: '1rem' }}>{children}</div>
    </div>
  )
}

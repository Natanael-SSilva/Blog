import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import TagCloud from '@/components/ui/TagCloud'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Explore todos os assuntos do blog',
}

export const revalidate = 600

async function getAllTags() {
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

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.75rem',
            opacity: 0.8,
          }}
        >
          ✦ Explorar
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--text)',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
        >
          Tags
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          {tags.length} {tags.length === 1 ? 'assunto' : 'assuntos'} — quanto maior, mais posts
        </p>
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, var(--gold-deep), transparent)',
            marginTop: '1.5rem',
            opacity: 0.5,
          }}
        />
      </div>

      {tags.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'var(--text-faint)',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '4rem',
          }}
        >
          Nenhuma tag ainda.
        </p>
      ) : (
        <TagCloud tags={tags} />
      )}
    </div>
  )
}

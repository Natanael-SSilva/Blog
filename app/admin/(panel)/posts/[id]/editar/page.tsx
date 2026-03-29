import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Post } from '@/types'
import PostForm from '@/components/admin/PostForm'

interface EditarPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarPostPage({ params }: EditarPostPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.from('posts').select('*').eq('id', id).single()

  if (!data) notFound()

  const post = data as Post

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--text)',
          marginBottom: '2rem',
        }}
      >
        Editar Post
      </h1>
      <PostForm post={post} />
    </div>
  )
}

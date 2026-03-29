import PostForm from '@/components/admin/PostForm'

export default function NovoPostPage() {
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
        Novo Post
      </h1>
      <PostForm />
    </div>
  )
}

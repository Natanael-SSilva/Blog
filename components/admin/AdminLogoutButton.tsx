'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        background: 'none',
        border: 'none',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.82rem',
        color: 'var(--text-faint)',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#e57373'
        e.currentTarget.style.backgroundColor = 'rgba(229,115,115,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-faint)'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <LogOut size={14} />
      Sair
    </button>
  )
}

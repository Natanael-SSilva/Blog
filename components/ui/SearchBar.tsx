'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar posts..."
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 2.5rem 0.5rem 0.75rem',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.82rem',
          color: 'var(--text)',
          outline: 'none',
          transition: 'border-color var(--transition)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--emerald)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
        }}
      />
      <button
        type="submit"
        style={{
          position: 'absolute',
          right: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--text-faint)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '0.25rem',
          transition: 'color var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--emerald-light)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-faint)'
        }}
        aria-label="Buscar"
      >
        <Search size={14} />
      </button>
    </form>
  )
}

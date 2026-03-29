interface MoodIndicatorProps {
  mood: string
  emoji: string
}

export default function MoodIndicator({ mood, emoji }: MoodIndicatorProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--bg-surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.4rem 0.85rem',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8rem',
      }}
    >
      <span style={{ fontSize: '0.9rem' }}>{emoji}</span>
      <span style={{ color: 'var(--text-faint)', letterSpacing: '0.05em' }}>Humor atual:</span>
      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{mood}</span>
    </div>
  )
}

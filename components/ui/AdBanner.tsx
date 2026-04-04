'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdBanner({ slot, format = 'auto' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Evita inicializar duas vezes em StrictMode
    if (initialized.current) return
    initialized.current = true

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  // Em desenvolvimento, mostra um placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          margin: '1.5rem 0',
          padding: '1rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          Anúncio — slot: {slot}
        </span>
      </div>
    )
  }

  return (
    <div style={{ margin: '1.5rem 0', textAlign: 'center', overflow: 'hidden' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

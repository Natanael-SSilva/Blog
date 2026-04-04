import { Feather } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'É um Blog'

  const socials = [
    {
      label: 'Instagram',
      href: 'https://instagram.com/eu.natanael.santos',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/natanael-santos-274709223',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/5597984133416',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ]

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        padding: '3rem 1.5rem 2rem',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      <style>{`
        .footer-link {
          font-family: var(--font-ui);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: var(--text-faint);
          text-decoration: none;
          transition: color var(--transition);
        }
        .footer-link:hover { color: var(--emerald-light); }
      `}</style>

      <div
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--gold-deep), transparent)',
          marginBottom: '2rem',
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: 'var(--page-max)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Feather size={14} color="var(--gold)" strokeWidth={1.5} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
            }}
          >
            {siteName}
          </span>
        </div>

        {/* Ícones sociais */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              aria-label={label}
              title={label}
            >
              {icon}
            </a>
          ))}
        </div>
        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            color: 'var(--text-faint)',
            letterSpacing: '0.05em',
          }}
        >
          © {year} {siteName}. ·{' '}
          <a href="/privacidade" style={{ color: 'var(--text-faint)', textDecoration: 'none' }}>
            Privacidade
          </a>
        </p>
      </div>
    </footer>
  )
}

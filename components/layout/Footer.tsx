import Link from 'next/link'
import { Feather } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'É um blog'

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

        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/" className="footer-link">
            Início
          </Link>
          <Link href="/busca" className="footer-link">
            Busca
          </Link>
        </nav>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            color: 'var(--text-faint)',
            letterSpacing: '0.05em',
          }}
        >
          © {year} {siteName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

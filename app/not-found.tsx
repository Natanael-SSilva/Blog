import Link from 'next/link'
import { Feather } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {/* Linha dourada */}
      <div
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
          marginBottom: '2.5rem',
        }}
      />

      {/* Ícone */}
      <div
        style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, var(--emerald-deep), var(--emerald))',
          borderRadius: '50%',
          border: '1px solid var(--gold-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <Feather size={26} color="var(--gold-light)" strokeWidth={1.5} />
      </div>

      {/* Número */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '6rem',
          fontWeight: 700,
          color: 'var(--emerald-deep)',
          lineHeight: 1,
          marginBottom: '1rem',
          letterSpacing: '0.1em',
          opacity: 0.6,
        }}
      >
        404
      </div>

      {/* Título */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--text)',
          marginBottom: '1rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        Página não encontrada
      </h1>

      {/* Descrição */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '400px',
          lineHeight: 1.75,
          fontStyle: 'italic',
          marginBottom: '2.5rem',
        }}
      >
        Esta página se perdeu nas névoas do tempo — ou nunca existiu.
      </p>

      {/* Links */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--bg)',
            backgroundColor: 'var(--gold)',
            padding: '0.7rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'background-color var(--transition)',
          }}
        >
          Voltar ao início
        </Link>
        <Link
          href="/busca"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            padding: '0.7rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            transition: 'all var(--transition)',
          }}
        >
          Buscar posts
        </Link>
      </div>

      {/* Linha dourada inferior */}
      <div
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
          marginTop: '2.5rem',
        }}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Feather, LayoutDashboard, FileText, Mail, Menu, X } from 'lucide-react'
import AdminLogoutButton from './AdminLogoutButton'

const NAV_ITEMS: { href: string; label: string; icon: React.ReactNode }[] = [
  { href: '/admin/posts', label: 'Posts', icon: <LayoutDashboard size={15} /> },
  { href: '/admin/posts/novo', label: 'Novo Post', icon: <FileText size={15} /> },
  { href: '/admin/newsletter', label: 'Newsletter', icon: <Mail size={15} /> },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const sidebarContent = (
    <>
      <div
        style={{
          padding: '1.25rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            background: 'linear-gradient(135deg, var(--emerald-deep), var(--emerald))',
            borderRadius: '50%',
            border: '1px solid var(--gold-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Feather size={12} color="var(--gold-light)" strokeWidth={1.5} />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.82rem',
              color: 'var(--text)',
              letterSpacing: '0.06em',
            }}
          >
            Admin
          </div>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              color: 'var(--text-faint)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Painel
          </div>
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/admin/posts/novo' &&
              item.href !== '/admin/posts' &&
              pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href as `/${string}`}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                color: active ? 'var(--emerald-light)' : 'var(--text-muted)',
                textDecoration: 'none',
                backgroundColor: active ? 'var(--emerald-deep)' : 'transparent',
                border: `1px solid ${active ? 'var(--emerald)' : 'transparent'}`,
                transition: 'all var(--transition)',
              }}
            >
              <span
                style={{
                  color: active ? 'var(--emerald-light)' : 'var(--text-faint)',
                  display: 'flex',
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.78rem',
            color: 'var(--text-faint)',
            textDecoration: 'none',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            display: 'block',
          }}
        >
          ← Ver blog
        </Link>
        <AdminLogoutButton />
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar desktop */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: '220px',
          flexShrink: 0,
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile topbar */}
      <div className="admin-topbar-mobile" style={{ display: 'none' }}>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            height: '56px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                background: 'linear-gradient(135deg, var(--emerald-deep), var(--emerald))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather size={10} color="var(--gold-light)" strokeWidth={1.5} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                color: 'var(--text)',
              }}
            >
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.5rem',
            }}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <>
            <div
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 210,
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '260px',
                zIndex: 220,
                backgroundColor: 'var(--bg-surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {sidebarContent}
            </div>
          </>
        )}
      </div>

      {/* Conteúdo */}
      <main
        className="admin-main"
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: 'var(--bg)',
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-topbar-mobile   { display: block !important; }
          .admin-main            { padding-top: calc(56px + 2rem) !important; }
        }
      `}</style>
    </div>
  )
}

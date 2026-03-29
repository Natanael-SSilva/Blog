import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import NewsletterToast from '@/components/ui/NewsletterToast'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div
        style={{
          maxWidth: 'var(--page-max)',
          margin: '0 auto',
          width: '100%',
          padding: '2rem 1.5rem',
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>

        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
      </div>

      <Footer />

      {/* Toast de feedback da newsletter — Suspense necessário por usar useSearchParams */}
      <Suspense fallback={null}>
        <NewsletterToast />
      </Suspense>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-wrapper { display: none; }
        }
      `}</style>
    </div>
  )
}

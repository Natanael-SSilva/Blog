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
        className="public-container"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto', width: '100%', flex: 1 }}
      >
        <div className="public-grid">
          <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />

      <Suspense fallback={null}>
        <NewsletterToast />
      </Suspense>
    </div>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'É UM BLOG',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'É um blog'}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Blog pessoal e criativo',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'É um blog',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

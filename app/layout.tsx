import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Cod'in — B2B Supplier Marketplace untuk UMKM",
  description:
    "Cod'in menghubungkan UMKM dan pengusaha pemula dengan supplier bahan baku terpercaya lewat asisten AI.",
  applicationName: "Cod'in",
  // Favicon uses the supplied Cod'in logo asset.
  icons: {
    icon: [{ url: '/codin-logo.jpeg', type: 'image/jpeg' }],
    apple: '/codin-logo.jpeg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0866E8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

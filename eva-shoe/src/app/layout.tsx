// src/app/layout.tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'EVA SHOE - Mode & Accessoires',
  description: 'Découvrez notre sélection de chaussures, vêtements et accessoires',
  keywords: ['chaussures', 'mode', 'accessoires', 'vêtements', 'fashion'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

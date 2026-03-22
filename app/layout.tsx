import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reportar Bug ou Melhoria | Casa do Urso',
  description: 'Sistema de tickets da Casa do Urso',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}

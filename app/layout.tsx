import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Foz.Foco — Notícias de Foz do Iguaçu',
    template: '%s | Foz.Foco',
  },
  description: 'O portal de notícias da tríplice fronteira. Fique por dentro de tudo que acontece em Foz do Iguaçu.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    siteName: 'Foz.Foco',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

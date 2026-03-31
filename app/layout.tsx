import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Foz em Foco — Noticias de Foz do Iguacu',
    template: '%s | Foz em Foco',
  },
  description: 'O portal de noticias da triplice fronteira. Fique por dentro de tudo que acontece em Foz do Iguacu.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    siteName: 'Foz em Foco',
    locale: 'pt_BR',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Foz em Foco — Noticias de Foz do Iguacu' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${dmSans.variable} ${dmSerif.variable}`}
    >
      <body style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

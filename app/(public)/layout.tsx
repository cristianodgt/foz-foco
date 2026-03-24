import { Header } from '@/components/public/Header'
import { StickyBanner } from '@/components/public/StickyBanner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <StickyBanner />
    </>
  )
}

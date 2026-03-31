import { Header } from '@/components/public/Header'
import { Footer } from '@/components/layout/Footer'
import { BreakingNewsBanner } from '@/components/news/BreakingNewsBanner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <BreakingNewsBanner />
      <main>{children}</main>
      <Footer />
    </>
  )
}

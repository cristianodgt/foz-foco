import { prisma } from '@/lib/prisma'
import { TopStrip } from '@/components/layout/TopStrip'
import { Header } from '@/components/public/Header'
import { CategoryNavBar } from '@/components/layout/CategoryNavBar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { StickyBanner } from '@/components/public/StickyBanner'

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, name: true, slug: true },
    })
  } catch {
    return []
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <TopStrip />
      <Header />
      <CategoryNavBar categories={categories} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <StickyBanner />
    </div>
  )
}

import Link from 'next/link'
import { BusinessCard } from './BusinessCard'
import { prisma } from '@/lib/prisma'

/**
 * BusinessDirectory — commercial listing grid.
 *
 * Rewritten in plan 01-03 as a Stitch-aligned 2→6 column tile grid. Still
 * used by /anunciantes (the landing page will be fully rebuilt in plan 01-04).
 * Returns null when Prisma cannot reach the DB so SSG with a placeholder
 * DATABASE_URL does not crash.
 */
export async function BusinessDirectory({ limit = 12 }: { limit?: number }) {
  let businesses: Array<{
    id: string
    name: string
    logo: string | null
    category: string
    phone: string | null
    whatsapp: string | null
    website: string | null
    isPremium: boolean
  }> = []

  try {
    businesses = await prisma.business.findMany({
      where: { active: true },
      orderBy: [{ isPremium: 'desc' }, { order: 'asc' }],
      take: limit,
      select: {
        id: true,
        name: true,
        logo: true,
        category: true,
        phone: true,
        whatsapp: true,
        website: true,
        isPremium: true,
      },
    })
  } catch {
    return null
  }

  if (businesses.length === 0) return null

  return (
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
            Estabelecimentos Parceiros
          </h2>
          <Link
            href="/anunciantes"
            className="text-primary font-bold text-sm font-label hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {businesses.map(b => (
            <BusinessCard
              key={b.id}
              name={b.name}
              logo={b.logo}
              category={b.category}
              phone={b.phone}
              whatsapp={b.whatsapp}
              website={b.website}
              isPremium={b.isPremium}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { BusinessCard } from './BusinessCard'
import { prisma } from '@/lib/prisma'

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
    <section style={{ margin: '40px 0' }}>
      <div className="section-header">
        <h2 className="section-title">Estabelecimentos Parceiros</h2>
        <Link
          href="/anunciantes"
          style={{ fontSize: 13, color: 'var(--color-brand)', fontWeight: 600, textDecoration: 'none' }}
        >
          Ver todos →
        </Link>
      </div>
      <div className="business-grid">
        {businesses.map((b) => (
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
    </section>
  )
}

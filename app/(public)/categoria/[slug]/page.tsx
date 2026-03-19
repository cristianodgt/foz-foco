import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { GridHome } from '@/components/feed/GridHome'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug, active: true } })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}
  return buildMetadata({
    title: `${category.name} — Foz.Foco`,
    description: `Notícias de ${category.name} em Foz do Iguaçu`,
    url: `/categoria/${slug}`,
  })
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  return (
    <div>
      {/* Category header overlay */}
      <div
        className="fixed top-14 left-0 right-0 z-30 flex items-center justify-center py-2 pointer-events-none"
      >
        <span
          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg"
          style={{ backgroundColor: category.color }}
        >
          {category.icon} {category.name}
        </span>
      </div>

      <GridHome category={slug} />
    </div>
  )
}

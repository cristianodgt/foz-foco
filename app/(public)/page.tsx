import { Metadata } from 'next'
import { GridHome } from '@/components/feed/GridHome'
import { prisma } from '@/lib/prisma'
import type { Post } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Foz.Foco — Notícias de Foz do Iguaçu',
  description: 'O portal de notícias da tríplice fronteira. Fique por dentro de tudo que acontece em Foz do Iguaçu.',
}

async function getInitialFeed() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 9,
    })
    return posts.map((post) => ({ type: 'post' as const, data: post as unknown as Post }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const initialItems = await getInitialFeed()

  return <GridHome initialItems={initialItems} />
}

import { Metadata } from 'next'
import { FeedContainer } from '@/components/feed/FeedContainer'
import { prisma } from '@/lib/prisma'

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
      take: 5,
    })
    return posts.map((post) => ({ type: 'post' as const, data: post }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const initialItems = await getInitialFeed()

  return <FeedContainer initialItems={initialItems} />
}

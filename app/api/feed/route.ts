import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const category = searchParams.get('category')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { status: 'PUBLISHED' }
    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } })
      if (cat) where.categoryId = cat.id
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, name: true, avatar: true } },
          tags: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    // Interleave ads
    const ads = await prisma.ad.findMany({
      where: {
        active: true,
        position: 'FEED_BETWEEN',
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
      },
    })

    type FeedItem =
      | { type: 'post'; data: typeof posts[0] }
      | { type: 'ad'; data: typeof ads[0] }

    const items: FeedItem[] = []
    let adIndex = 0

    posts.forEach((post, index) => {
      items.push({ type: 'post', data: post })
      // Insert ad every N posts based on frequency
      if (ads.length > 0) {
        const freq = ads[adIndex % ads.length]?.frequency || 5
        if ((index + 1) % freq === 0) {
          items.push({ type: 'ad', data: ads[adIndex % ads.length] })
          adIndex++
        }
      }
    })

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      hasMore: skip + limit < total,
    })
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json({ error: 'Erro ao carregar feed' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      activeAds,
      topPosts,
      recentPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.ad.count({ where: { active: true, startsAt: { lte: new Date() }, endsAt: { gte: new Date() } } }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, title: true, views: true, slug: true },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, createdAt: true, slug: true },
      }),
    ])

    const allViewsResult = await prisma.post.aggregate({ _sum: { views: true } })
    const totalViews = allViewsResult._sum.views || 0

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      viewsToday: 0, // Would need a separate views log table for accurate daily stats
      activeAds,
      topPosts,
      recentPosts,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Erro ao buscar métricas' }, { status: 500 })
  }
}

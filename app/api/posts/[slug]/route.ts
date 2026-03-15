import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const post = await prisma.post.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
    })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {})
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 })
  }
}

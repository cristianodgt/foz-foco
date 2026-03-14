import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
        tags: true,
      },
    })
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 })
  }
}

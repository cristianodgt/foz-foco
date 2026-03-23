import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { title, summary, content, categoryId, coverImage, media, status, featured, tags = [] } = body

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

    const tagConnections = await Promise.all(
      tags.map((tagName: string) =>
        prisma.tag.upsert({
          where: { slug: generateSlug(tagName) },
          update: {},
          create: { name: tagName, slug: generateSlug(tagName) },
        })
      )
    )

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        categoryId,
        coverImage,
        media: media ?? [],
        status,
        featured,
        publishedAt: status === 'PUBLISHED' && !post.publishedAt ? new Date() : post.publishedAt,
        tags: { set: tagConnections.map((t) => ({ id: t.id })) },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
        tags: true,
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

    await prisma.post.update({
      where: { id },
      data: { tags: { set: [] } },
    })
    await prisma.post.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 })
  }
}

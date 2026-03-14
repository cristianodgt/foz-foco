import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
    })
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 })
  }
}

const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  summary: z.string().min(10).max(500).optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { slug } = await params
    const body = await request.json()
    const data = updatePostSchema.parse(body)

    const existing = await prisma.post.findUnique({ where: { slug } })
    if (!existing) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

    const updateData: Record<string, unknown> = { ...data }

    if (data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date()
    }

    if (data.tags !== undefined) {
      const tagConnections = await Promise.all(
        data.tags.map((tagName) =>
          prisma.tag.upsert({
            where: { slug: generateSlug(tagName) },
            update: {},
            create: { name: tagName, slug: generateSlug(tagName) },
          })
        )
      )
      updateData.tags = { set: tagConnections.map((t) => ({ id: t.id })) }
      delete updateData['tags']
      ;(updateData as Record<string, unknown>).tags = {
        set: tagConnections.map((t) => ({ id: t.id })),
      }
    }

    const post = await prisma.post.update({
      where: { slug },
      data: updateData,
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { slug } = await params
    await prisma.post.delete({ where: { slug } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 })
  }
}

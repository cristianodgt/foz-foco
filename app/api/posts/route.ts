import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  summary: z.string().min(10).max(500),
  content: z.string().min(1),
  categoryId: z.string(),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { status: 'PUBLISHED' }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ]
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

    return NextResponse.json({
      data: posts,
      total,
      page,
      limit,
      hasMore: skip + limit < total,
    })
  } catch (error) {
    console.error('Posts GET error:', error)
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const data = createPostSchema.parse(body)

    let slug = generateSlug(data.title)

    // Ensure unique slug
    const existing = await prisma.post.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    // Upsert tags
    const tagConnections = await Promise.all(
      data.tags.map((tagName) =>
        prisma.tag.upsert({
          where: { slug: generateSlug(tagName) },
          update: {},
          create: { name: tagName, slug: generateSlug(tagName) },
        })
      )
    )

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        featured: data.featured,
        categoryId: data.categoryId,
        authorId: session.id,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        tags: { connect: tagConnections.map((t) => ({ id: t.id })) },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Post create error:', error)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}

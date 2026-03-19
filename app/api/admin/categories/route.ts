import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all categories (including inactive) for admin
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
  }
}

// POST create new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, slug, color, icon, order, active } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        color: color || '#3B82F6',
        icon: icon || null,
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe uma categoria com esse nome ou slug' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}

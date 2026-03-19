import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update category
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, slug, color, icon, order, active } = body

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe uma categoria com esse nome ou slug' }, { status: 409 })
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if category has posts
    const postCount = await prisma.post.count({ where: { categoryId: id } })
    if (postCount > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir: ${postCount} notícia(s) usam esta categoria` },
        { status: 409 }
      )
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 })
  }
}

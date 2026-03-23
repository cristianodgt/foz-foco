import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'EDITOR']).optional(),
  active: z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const data = updateUserSchema.parse(body)

    // Não permite remover o próprio cargo de ADMIN
    if (id === session.id && data.role && data.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Você não pode rebaixar seu próprio cargo' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.active !== undefined) updateData.active = data.active
    if (data.password) updateData.password = await hashPassword(data.password)

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, active: true },
    })

    return NextResponse.json(user)
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 })
    }
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Este email já está em uso' }, { status: 409 })
    }
    const status = e.message?.includes('Acesso negado') ? 403 : e.message?.includes('autenticado') ? 401 : 500
    return NextResponse.json({ error: e.message || 'Erro ao atualizar usuário' }, { status })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin()
    const { id } = await params

    if (id === session.id) {
      return NextResponse.json({ error: 'Você não pode excluir sua própria conta' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    const status = e.message?.includes('Acesso negado') ? 403 : e.message?.includes('autenticado') ? 401 : 500
    return NextResponse.json({ error: e.message || 'Erro ao excluir usuário' }, { status })
  }
}

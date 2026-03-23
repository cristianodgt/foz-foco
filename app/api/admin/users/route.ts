import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  role: z.enum(['ADMIN', 'EDITOR']),
})

export async function GET() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        active: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(users)
  } catch (e: any) {
    const status = e.message?.includes('Acesso negado') ? 403 : e.message?.includes('autenticado') ? 401 : 500
    return NextResponse.json({ error: e.message || 'Erro ao buscar usuários' }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = createUserSchema.parse(body)

    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) {
      return NextResponse.json({ error: 'Já existe um usuário com este email' }, { status: 409 })
    }

    const hashed = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role,
        active: true,
      },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 })
    }
    const status = e.message?.includes('Acesso negado') ? 403 : e.message?.includes('autenticado') ? 401 : 500
    return NextResponse.json({ error: e.message || 'Erro ao criar usuário' }, { status })
  }
}

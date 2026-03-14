import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email, active: true } })
    if (!user) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
  }
}

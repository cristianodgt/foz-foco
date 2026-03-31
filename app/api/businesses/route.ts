import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      where: { active: true },
      orderBy: [{ isPremium: 'desc' }, { order: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(businesses)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar estabelecimentos' }, { status: 500 })
  }
}

const businessSchema = z.object({
  name: z.string().min(2),
  logo: z.string().url().optional().nullable(),
  category: z.enum(['ALIMENTACAO', 'SAUDE', 'SERVICOS', 'EDUCACAO', 'COMERCIO', 'ESPORTES', 'AUTOMOTIVO', 'IMOBILIARIO', 'OUTRO']),
  description: z.string().min(5),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  isPremium: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
})

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = businessSchema.parse(body)
    const business = await prisma.business.create({ data })
    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar estabelecimento' }, { status: 500 })
  }
}

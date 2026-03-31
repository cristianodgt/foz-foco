import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

interface Params {
  params: Promise<{ id: string }>
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().url().optional().nullable(),
  category: z.enum(['ALIMENTACAO', 'SAUDE', 'SERVICOS', 'EDUCACAO', 'COMERCIO', 'ESPORTES', 'AUTOMOTIVO', 'IMOBILIARIO', 'OUTRO']).optional(),
  description: z.string().min(5).optional(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  isPremium: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
})

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)
    const business = await prisma.business.update({ where: { id }, data })
    return NextResponse.json(business)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar estabelecimento' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    await prisma.business.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar estabelecimento' }, { status: 500 })
  }
}

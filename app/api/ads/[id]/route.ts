import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

interface Params {
  params: Promise<{ id: string }>
}

const adUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.enum(['BANNER', 'NATIVE', 'INTERSTITIAL']).optional(),
  imageUrl: z.string().url().optional(),
  targetUrl: z.string().url().optional(),
  client: z.string().min(2).optional(),
  position: z.enum(['FEED_BETWEEN', 'FEED_TOP', 'GRID_BANNER', 'GRID_BANNER_TOP', 'GRID_BANNER_BOTTOM', 'POST_DETAIL', 'SIDEBAR']).optional(),
  frequency: z.number().int().min(1).optional(),
  active: z.boolean().optional(),
  startsAt: z.string().transform((s) => new Date(s)).optional(),
  endsAt: z.string().transform((s) => new Date(s)).optional(),
})

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const data = adUpdateSchema.parse(body)
    const ad = await prisma.ad.update({ where: { id }, data })
    return NextResponse.json(ad)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar anúncio' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    await prisma.ad.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar anúncio' }, { status: 500 })
  }
}

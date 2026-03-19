import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')

    const where: Record<string, unknown> = {}
    if (position) {
      where.position = position
      where.active = true
      where.startsAt = { lte: new Date() }
      where.endsAt = { gte: new Date() }
    }

    const ads = await prisma.ad.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(ads)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar anúncios' }, { status: 500 })
  }
}

const adSchema = z.object({
  title: z.string().min(3),
  type: z.enum(['BANNER', 'NATIVE', 'INTERSTITIAL']),
  imageUrl: z.string().url(),
  targetUrl: z.string().url(),
  client: z.string().min(2),
  position: z.enum(['FEED_BETWEEN', 'FEED_TOP', 'GRID_BANNER', 'POST_DETAIL', 'SIDEBAR']),
  frequency: z.number().int().min(1).default(5),
  active: z.boolean().default(true),
  startsAt: z.string().transform((s) => new Date(s)),
  endsAt: z.string().transform((s) => new Date(s)),
})

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = adSchema.parse(body)
    const ad = await prisma.ad.create({ data })
    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar anúncio' }, { status: 500 })
  }
}

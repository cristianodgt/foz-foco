import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const ad = await prisma.ad.update({ where: { id }, data: body })
    return NextResponse.json(ad)
  } catch {
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

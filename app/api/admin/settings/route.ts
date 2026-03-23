import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const config = await prisma.siteConfig.upsert({
      where: { id: 'main' },
      update: {
        siteName: body.siteName,
        tagline: body.tagline,
        logo: body.logo,
        social: body.social,
      },
      create: {
        id: 'main',
        siteName: body.siteName || 'Foz.Foco',
        tagline: body.tagline || 'Notícias de Foz do Iguaçu',
        logo: body.logo,
        social: body.social,
      },
    })
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}

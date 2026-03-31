import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export async function BreakingNewsBanner() {
  let breakingPost: { title: string; slug: string } | null = null

  try {
    breakingPost = await prisma.post.findFirst({
      where: { status: 'PUBLISHED', featured: true },
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true },
    })
  } catch {
    return null
  }

  if (!breakingPost) return null

  return (
    <div className="breaking-banner">
      <span className="breaking-pulse" />
      <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: 12, flexShrink: 0 }}>
        DESTAQUE
      </span>
      <p style={{ flex: 1, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {breakingPost.title}
      </p>
      <Link
        href={`/${breakingPost.slug}`}
        style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: 'white', textDecoration: 'underline', opacity: 0.9 }}
      >
        Ler mais →
      </Link>
    </div>
  )
}

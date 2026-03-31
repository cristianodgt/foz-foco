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
    <div style={{ padding: '0 16px', background: 'var(--color-page-bg)' }}>
      <div className="breaking-banner" style={{ borderRadius: '0 0 12px 12px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        <span className="breaking-pulse" />
        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: 10, flexShrink: 0, background: 'rgba(255,215,0,0.2)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,215,0,0.3)' }}>
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
      </div>
    </div>
  )
}

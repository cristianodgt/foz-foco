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
    <div className="w-full bg-secondary text-on-secondary py-2 px-4">
      <div className="max-w-[1200px] mx-auto flex items-center gap-3 text-xs font-label font-bold uppercase tracking-widest">
        <span className="bg-white text-secondary px-2 py-0.5 rounded-full">URGENTE</span>
        <Link
          href={`/${breakingPost.slug}`}
          className="truncate hover:underline flex-1 min-w-0"
        >
          {breakingPost.title}
        </Link>
      </div>
    </div>
  )
}

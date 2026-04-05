import Link from 'next/link'
import type { Post } from '@/types'

interface MaisLidasProps {
  posts: Post[]
}

/**
 * MaisLidas — editorial "most read" widget.
 *
 * Mirrors Stitch desktop.html Row 5 right-column Mais Lidas block:
 *   - border-b-4 border-primary heading with wide Newsreader uppercase type
 *   - italic Newsreader numbers 01/02/03 in surface-variant tone
 *   - title + view count per item
 *
 * Replaces the legacy `TrendingWidget` component. Pass the top N posts by views
 * (homepage passes 3, post/category pages pass up to 5).
 */
export function MaisLidas({ posts }: MaisLidasProps) {
  if (!posts.length) return null

  return (
    <section className="space-y-4">
      <h3 className="border-b-4 border-primary inline-block pr-8 pb-2 text-xl font-headline font-bold uppercase tracking-tight text-on-surface">
        Mais Lidas
      </h3>
      <ul className="space-y-6 pt-4">
        {posts.map((post, idx) => (
          <li key={post.id} className="flex gap-4 items-start">
            <span className="text-3xl font-black text-surface-variant font-headline italic shrink-0 leading-none">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                href={`/${post.slug}`}
                className="font-headline font-bold leading-tight text-on-surface hover:text-primary transition-colors block"
              >
                {post.title}
              </Link>
              {typeof post.views === 'number' && (
                <p className="text-[10px] text-outline font-medium mt-1 font-label">
                  {post.views.toLocaleString('pt-BR')} visualizações
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

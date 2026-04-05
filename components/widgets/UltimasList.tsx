import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Post } from '@/types'

interface UltimasListProps {
  posts: Post[]
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * UltimasList — sidebar "Últimas" linear list.
 *
 * Mirrors Stitch desktop.html Row 5 right-column Últimas block:
 *   - border-b-4 border-secondary heading
 *   - divide-y list of HH:MM prefixed links
 */
export function UltimasList({ posts }: UltimasListProps) {
  if (!posts.length) return null

  return (
    <section className="space-y-4">
      <h3 className="border-b-4 border-secondary inline-block pr-8 pb-2 text-xl font-headline font-bold uppercase tracking-tight text-on-surface">
        Últimas
      </h3>
      <ul className="divide-y divide-outline-variant/30 pt-2">
        {posts.map(post => {
          const date = toDate(post.publishedAt)
          const time = date ? format(date, 'HH:mm', { locale: ptBR }) : ''
          return (
            <li key={post.id} className="py-3">
              <Link
                href={`/${post.slug}`}
                className="text-sm font-medium font-body text-on-surface hover:text-primary transition-colors block"
              >
                {time && <time className="text-outline font-bold mr-2">{time}</time>}
                — {post.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

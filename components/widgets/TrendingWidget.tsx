import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import type { Post } from '@/types'

interface TrendingWidgetProps {
  posts: Post[]
}

export function TrendingWidget({ posts }: TrendingWidgetProps) {
  if (!posts.length) return null

  return (
    <div className="widget">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUp size={16} color="var(--color-brand)" />
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-primary)' }}>
          Mais lidas
        </h3>
      </div>

      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.slice(0, 5).map((post, i) => (
          <li key={post.id}>
            <Link
              href={`/${post.slug}`}
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none', textDecoration: 'none' }}
            >
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                fontFamily: 'var(--font-bebas)',
                color: i === 0 ? 'var(--color-brand)' : 'var(--color-text-muted)',
                lineHeight: 1,
                minWidth: 24,
                flexShrink: 0
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text-primary)' }}
                className="line-clamp-2">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

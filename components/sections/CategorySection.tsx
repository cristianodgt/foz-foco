import Link from 'next/link'
import { ArticleCard } from '@/components/news/ArticleCard'
import { AdSectionSponsor } from '@/components/ads/AdSectionSponsor'
import type { Post } from '@/types'

interface CategorySectionProps {
  title: string
  slug: string
  posts: Post[]
  layout?: 'grid' | 'featured-list'
  showSponsor?: boolean
}

export function CategorySection({ title, slug, posts, layout = 'grid', showSponsor = false }: CategorySectionProps) {
  if (!posts.length) return null

  const [featured, ...rest] = posts

  return (
    <section style={{ margin: '40px 0' }}>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h2 className="section-title">{title}</h2>
          {showSponsor && <AdSectionSponsor categorySlug={slug} />}
        </div>
        <Link href={`/categoria/${slug}`} style={{ fontSize: 13, color: 'var(--color-brand)', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
          Ver mais →
        </Link>
      </div>

      {layout === 'featured-list' ? (
        /* Featured à esquerda + lista compacta à direita */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <ArticleCard post={featured} variant="featured" />
          <div>
            {rest.slice(0, 4).map(post => (
              <ArticleCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      ) : (
        /* Grid 3 colunas */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="cat-grid">
          {posts.slice(0, 3).map(post => (
            <ArticleCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

import { ArticleCard } from '@/components/news/ArticleCard'
import { AdSponsoredCard } from '@/components/ads/AdSponsoredCard'
import type { Post } from '@/types'
import type { Ad } from '@/types'

interface MainGridProps {
  posts: Post[]
  sponsoredAd?: Ad | null
}

// Injeta card patrocinado a cada 4 posts
function buildGridItems(posts: Post[], ad: Ad | null) {
  const items: Array<{ type: 'post'; post: Post } | { type: 'ad'; ad: Ad }> = []
  posts.forEach((post, i) => {
    items.push({ type: 'post', post })
    if (ad && (i + 1) % 4 === 0) items.push({ type: 'ad', ad })
  })
  return items
}

export function MainGrid({ posts, sponsoredAd }: MainGridProps) {
  if (!posts.length) return null

  const [featured, ...rest] = posts
  const gridItems = buildGridItems(rest.slice(0, 8), sponsoredAd || null)

  return (
    <div>
      {/* Featured + 2 standard — layout assimétrico */}
      <div className="main-grid" style={{ marginBottom: 24 }}>
        {/* Featured — ocupa 2 colunas x 2 linhas */}
        <div className="main-grid-featured">
          <ArticleCard post={featured} variant="featured" priority />
        </div>

        {/* 4 standard cards ao lado */}
        {rest.slice(0, 4).map((post, i) => (
          <ArticleCard key={post.id} post={post} variant="standard" priority={i < 2} />
        ))}
      </div>

      {/* Grid secundário — 4 colunas, com ad patrocinado injetado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="secondary-grid">
        {gridItems.map((item, i) =>
          item.type === 'ad' ? (
            <AdSponsoredCard key={`ad-${i}`} ad={item.ad} />
          ) : (
            <ArticleCard key={item.post.id} post={item.post} variant="standard" />
          )
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .secondary-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .secondary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

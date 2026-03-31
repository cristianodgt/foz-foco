import { AdSidebarSticky } from '@/components/ads/AdSidebarSticky'
import { TrendingWidget } from '@/components/widgets/TrendingWidget'
import { NewsletterWidget } from '@/components/widgets/NewsletterWidget'
import type { Post } from '@/types'

interface SidebarProps {
  trendingPosts?: Post[]
}

export function Sidebar({ trendingPosts = [] }: SidebarProps) {
  return (
    <aside style={{ position: 'sticky', top: 120 }}>
      {/* 1º Ad 300x250 */}
      <AdSidebarSticky />

      {/* Mais lidas */}
      {trendingPosts.length > 0 && <TrendingWidget posts={trendingPosts} />}

      {/* Newsletter */}
      <NewsletterWidget />

      {/* 2º Ad (mesmo componente — exibe próximo do rotator) */}
      <AdSidebarSticky />
    </aside>
  )
}

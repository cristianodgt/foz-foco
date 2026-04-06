import { MaisLidas } from '@/components/widgets/MaisLidas'
import { UltimasList } from '@/components/widgets/UltimasList'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Post } from '@/types'

interface SidebarProps {
  trendingPosts?: Post[]
  latestPosts?: Post[]
}

/**
 * Homepage Sidebar — 4-block stack (desktop only).
 *
 * 1. Halfpage ad (300x600) via <AdSlot format="halfpage" position="SIDEBAR" />
 * 2. Mais Lidas (top 3 by views)
 * 3. Rectangle ad (300x250) via <AdSlot format="rectangle" position="SIDEBAR" index={1} />
 * 4. Últimas linear list (5 most recent)
 *
 * Both ad slots fetch the same `SIDEBAR` position (the Prisma enum does not
 * distinguish halfpage vs rectangle). If the endpoint returns multiple ads,
 * the halfpage picks index [0] and the rectangle picks index [1]; otherwise
 * both will show the same creative. Backend scope change is out of phase 1.
 *
 * Hidden below `lg` — on mobile, the sidebar is not rendered here; the
 * homepage inlines a Mais Lidas card in the main column instead.
 */
export function Sidebar({ trendingPosts = [], latestPosts = [] }: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:col-span-4 space-y-12">
      {/* Block 1 — Halfpage ad */}
      <AdSlot format="halfpage" position="SIDEBAR" index={0} />

      {/* Block 2 — Mais Lidas */}
      <MaisLidas posts={trendingPosts.slice(0, 3)} />

      {/* Block 3 — Rectangle ad */}
      <AdSlot format="rectangle" position="SIDEBAR" index={1} />

      {/* Block 4 — Últimas */}
      <UltimasList posts={latestPosts.slice(0, 11)} />
    </aside>
  )
}

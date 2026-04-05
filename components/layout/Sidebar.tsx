import { MaisLidas } from '@/components/widgets/MaisLidas'
import { UltimasList } from '@/components/widgets/UltimasList'
import type { Post } from '@/types'

interface SidebarProps {
  trendingPosts?: Post[]
  latestPosts?: Post[]
}

/**
 * Homepage Sidebar — 4-block stack (desktop only).
 *
 * 1. Halfpage ad placeholder (300x600) — TODO(01-04): real AdSlot
 * 2. Mais Lidas (top 3 by views)
 * 3. Rectangle ad placeholder (300x250) — TODO(01-04): real AdSlot
 * 4. Últimas linear list (5 most recent)
 *
 * Hidden below `lg` — on mobile, the sidebar is not rendered here; the
 * homepage inlines a Mais Lidas card in the main column instead.
 */
export function Sidebar({ trendingPosts = [], latestPosts = [] }: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:col-span-4 space-y-12">
      {/* Block 1 — Halfpage ad
          TODO(01-04): replace with <AdSlot format="halfpage" position="SIDEBAR" /> */}
      <div className="w-[300px] h-[600px] mx-auto bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center relative rounded-md">
        <span className="absolute top-1 left-2 text-[8px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-1 rounded-sm font-label">
          PUBLICIDADE
        </span>
        <span className="text-outline text-xs italic font-label">
          [ 300×600 — Espaço disponível ]
        </span>
      </div>

      {/* Block 2 — Mais Lidas */}
      <MaisLidas posts={trendingPosts.slice(0, 3)} />

      {/* Block 3 — Rectangle ad
          TODO(01-04): replace with <AdSlot format="rectangle" position="SIDEBAR" /> */}
      <div className="w-[300px] h-[250px] mx-auto bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center relative rounded-md">
        <span className="absolute top-1 left-2 text-[8px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-1 rounded-sm font-label">
          PUBLICIDADE
        </span>
        <span className="text-outline text-xs italic font-label">
          [ 300×250 — Espaço disponível ]
        </span>
      </div>

      {/* Block 4 — Últimas */}
      <UltimasList posts={latestPosts.slice(0, 5)} />
    </aside>
  )
}

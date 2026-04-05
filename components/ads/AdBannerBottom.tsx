import { AdSlot } from './AdSlot'

/**
 * Thin wrapper around <AdSlot>. All fetch + impression + click tracking lives
 * in AdSlot. Kept for backwards compatibility with post detail and category
 * pages.
 */
export function AdBannerBottom() {
  return (
    <AdSlot
      format="leaderboard"
      position="GRID_BANNER_BOTTOM"
      className="bg-surface py-8"
    />
  )
}

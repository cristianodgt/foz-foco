import { AdSlot } from './AdSlot'

/**
 * Thin wrapper around <AdSlot>. All fetch + impression + click tracking lives
 * in AdSlot. Kept for backwards compatibility with pages that import it
 * (post detail, category list).
 */
export function AdBannerTop() {
  return (
    <AdSlot
      format="leaderboard"
      position="GRID_BANNER_TOP"
      className="bg-surface py-4"
    />
  )
}

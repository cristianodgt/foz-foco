import { AdSlot } from './AdSlot'

/**
 * Thin wrapper around <AdSlot>. Defaults to the 300×250 rectangle format used
 * by post detail and category sidebars. The homepage Sidebar imports <AdSlot>
 * directly to render both halfpage and rectangle variants.
 */
export function AdSidebarSticky() {
  return <AdSlot format="rectangle" position="SIDEBAR" />
}

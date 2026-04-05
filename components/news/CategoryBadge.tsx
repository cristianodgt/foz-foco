interface CategoryBadgeProps {
  /** Category display name */
  name: string
  /** Optional override background color (hex). When omitted, defaults to M3 tertiary-fixed amber. */
  color?: string
  /** Optional leading icon (emoji or single glyph). */
  icon?: string | null
  /** Badge scale. */
  size?: 'sm' | 'md'
}

/**
 * CategoryBadge — uppercase editorial eyebrow.
 *
 * Default treatment (plan 01-03) is bg-tertiary-fixed (#ffdeac) / text-on-tertiary-fixed
 * for the Stitch amber pill. Callers may still pass `color` to force a
 * per-category override (used in dense editorial pages where the category
 * color matters more than brand consistency).
 */
export function CategoryBadge({ name, color, icon, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses =
    size === 'sm'
      ? 'text-[9px] px-1.5 py-0.5'
      : 'text-[10px] px-2 py-1'

  const style = color ? { backgroundColor: color, color: '#fff' } : undefined
  const toneClasses = color ? '' : 'bg-tertiary-fixed text-on-tertiary-fixed'

  return (
    <span
      className={`inline-block rounded-sm font-bold uppercase tracking-widest font-label ${toneClasses} ${sizeClasses}`}
      style={style}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {name}
    </span>
  )
}

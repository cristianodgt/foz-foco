interface CategoryBadgeProps {
  name: string
  color?: string
  icon?: string | null
  size?: 'sm' | 'md'
}

export function CategoryBadge({ name, color = '#FF3B30', icon, size = 'md' }: CategoryBadgeProps) {
  return (
    <span
      className="category-badge"
      style={{
        backgroundColor: color,
        fontSize: size === 'sm' ? 10 : 11,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
      }}
    >
      {icon && <span style={{ marginRight: 3 }}>{icon}</span>}
      {name}
    </span>
  )
}

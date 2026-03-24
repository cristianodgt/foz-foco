interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { fontSize: 18, dotSize: 22, letterSpacing: 1 },
  md: { fontSize: 20, dotSize: 24, letterSpacing: 1.5 },
  lg: { fontSize: 48, dotSize: 58, letterSpacing: 3 },
}

export function Logo({ variant = 'light', size = 'sm', className }: LogoProps) {
  const textColor = variant === 'light' ? '#FFFFFF' : '#000000'
  const { fontSize, dotSize, letterSpacing } = sizes[size]
  const totalWidth = fontSize * 7.2 + dotSize * 0.6
  const height = fontSize * 1.4

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Foz em Foco"
    >
      <text
        x="0"
        y={height * 0.82}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        letterSpacing={letterSpacing}
        fill={textColor}
      >
        FOZ
      </text>
      <text
        x={fontSize * 3.05 + letterSpacing * 2}
        y={height * 0.82}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize={dotSize}
        fill="#FF6B00"
      >
        .
      </text>
      <text
        x={fontSize * 3.05 + letterSpacing * 2 + dotSize * 0.42}
        y={height * 0.82}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        letterSpacing={letterSpacing}
        fill={textColor}
      >
        FOCO
      </text>
    </svg>
  )
}

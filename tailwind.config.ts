import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // ─── Stitch M3 palette (verbatim from RESEARCH §1.5) ───────
        'primary': '#00355f',
        'primary-container': '#0f4c81',
        'primary-fixed': '#d2e4ff',
        'primary-fixed-dim': '#a0c9ff',
        'on-primary': '#ffffff',
        'on-primary-container': '#8ebdf9',
        'on-primary-fixed': '#001c37',
        'on-primary-fixed-variant': '#07497d',
        'secondary': '#bc0004',
        'secondary-container': '#e42018',
        'secondary-fixed': '#ffdad5',
        'secondary-fixed-dim': '#ffb4a9',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#fffbff',
        'on-secondary-fixed': '#410000',
        'on-secondary-fixed-variant': '#930002',
        'tertiary': '#472f00',
        'tertiary-container': '#644400',
        'tertiary-fixed': '#ffdeac',
        'tertiary-fixed-dim': '#ffba38',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#f5ac00',
        'on-tertiary-fixed': '#281900',
        'on-tertiary-fixed-variant': '#604100',
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        'surface': '#fcf8ff',
        'surface-bright': '#fcf8ff',
        'surface-dim': '#dad7f3',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f2ff',
        'surface-container': '#efecff',
        'surface-container-high': '#e8e5ff',
        'surface-container-highest': '#e2e0fc',
        'surface-variant': '#e2e0fc',
        'surface-tint': '#2d6197',
        'on-surface': '#1a1a2e',
        'on-surface-variant': '#42474f',
        'on-background': '#1a1a2e',
        // `background` uses the shadcn HSL var so dark mode flips correctly.
        // In light mode it resolves to #fcf8ff (surface), matching M3.
        'background': 'hsl(var(--background))',
        'inverse-surface': '#2f2e43',
        'inverse-on-surface': '#f2efff',
        'inverse-primary': '#a0c9ff',
        'outline': '#727780',
        'outline-variant': '#c2c7d1',

        // ─── shadcn HSL tokens (preserved for Radix components) ───
        // Kept under flat keys so shadcn/ui base utilities (border, input,
        // ring, muted, card, popover, accent, destructive, foreground) keep
        // working alongside the top-level M3 tokens. The M3 `background` hex
        // (#fcf8ff) equals the HSL --background triplet, so `bg-background`
        // resolves consistently in both light and dark mode via the top-level
        // key. `foreground` is exposed as an HSL alias because dark mode
        // needs to flip it (on-surface → surface).
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        // M3 radii scale (RESEARCH §1.5)
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
        // Legacy shadcn-compatible keys (kept for Radix primitives)
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'Newsreader', 'serif'],
        body: ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
        label: ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

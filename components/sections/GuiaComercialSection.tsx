import Link from 'next/link'
import {
  UtensilsCrossed,
  Bed,
  ShoppingBag,
  HeartPulse,
  Wrench,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react'

interface Tile {
  label: string
  href: string
  Icon: LucideIcon
  cta?: boolean
}

const TILES: Tile[] = [
  { label: 'Restaurantes', href: '/categoria/gastronomia', Icon: UtensilsCrossed },
  { label: 'Hotéis', href: '/categoria/turismo', Icon: Bed },
  { label: 'Compras', href: '/categoria/comercio', Icon: ShoppingBag },
  { label: 'Saúde', href: '/categoria/saude', Icon: HeartPulse },
  { label: 'Serviços', href: '/categoria/servicos', Icon: Wrench },
  { label: 'Cadastre-se', href: '/anunciantes', Icon: PlusCircle, cta: true },
]

/**
 * GuiaComercialSection — full-width commercial directory row.
 *
 * Mirrors Stitch desktop.html Row 6 (icon tiles). Premium editorial styling
 * with soft shadows, hover lift, gradient CTA tile.
 */
export function GuiaComercialSection() {
  return (
    <section className="bg-gradient-to-b from-surface-container to-surface py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface">
            Guia Comercial
          </h2>
          <Link
            href="/anunciantes"
            className="text-primary font-bold text-sm font-label hover:underline underline-offset-4"
          >
            Ver todos &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {TILES.map(({ label, href, Icon, cta }) => (
            <Link
              key={label}
              href={href}
              className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                cta
                  ? 'bg-gradient-to-br from-on-tertiary-container/15 to-on-tertiary-container/5 border-2 border-dashed border-on-tertiary-container/40 shadow-[0_4px_20px_-6px_rgba(245,172,0,0.3)] hover:shadow-[0_12px_32px_-8px_rgba(245,172,0,0.45)] hover:border-on-tertiary-container/60'
                  : 'bg-white dark:bg-inverse-surface/10 shadow-[0_2px_12px_-4px_rgba(26,26,46,0.08)] ring-1 ring-on-surface/5 hover:shadow-[0_12px_32px_-8px_rgba(26,26,46,0.18)] hover:ring-on-surface/10'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  cta
                    ? 'bg-on-tertiary-container/20'
                    : 'bg-primary/5'
                }`}
              >
                <Icon
                  className={`w-7 h-7 ${cta ? 'text-on-tertiary-container' : 'text-primary'}`}
                  strokeWidth={1.5}
                />
              </div>
              <span className={`font-bold text-xs uppercase tracking-wider text-center font-label ${
                cta ? 'text-on-tertiary-container' : 'text-on-surface'
              }`}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

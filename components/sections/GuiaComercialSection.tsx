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
 * Mirrors Stitch desktop.html Row 6 (2x6 icon tiles) and mobile-b section 6
 * (2-col stacked tiles). Tiles are static links to existing category/anunciantes
 * routes until a dedicated Business model is wired in a future plan.
 */
export function GuiaComercialSection() {
  return (
    <section className="bg-surface-container py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface">
            Guia Comercial
          </h2>
          <Link
            href="/anunciantes"
            className="text-primary font-bold text-sm font-label hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {TILES.map(({ label, href, Icon, cta }) => (
            <Link
              key={label}
              href={href}
              className={`group rounded-md shadow-sm flex flex-col items-center justify-center gap-2 p-4 aspect-square md:aspect-auto md:h-[120px] transition-shadow hover:shadow-md ${
                cta
                  ? 'bg-on-tertiary-container/10 border-2 border-dashed border-on-tertiary-container/40 text-on-tertiary-container'
                  : 'bg-white text-on-surface'
              }`}
            >
              <Icon
                className={`w-7 h-7 ${cta ? 'text-on-tertiary-container' : 'text-primary'}`}
              />
              <span className="font-bold text-xs uppercase tracking-wider text-center font-label">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

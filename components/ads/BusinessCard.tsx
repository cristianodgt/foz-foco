import Image from 'next/image'

interface BusinessCardProps {
  name: string
  logo?: string | null
  emoji?: string
  category: string
  phone?: string | null
  whatsapp?: string | null
  website?: string | null
  isPremium?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  ALIMENTACAO: 'Alimentação',
  SAUDE: 'Saúde',
  SERVICOS: 'Serviços',
  EDUCACAO: 'Educação',
  COMERCIO: 'Comércio',
  ESPORTES: 'Esportes',
  AUTOMOTIVO: 'Automotivo',
  IMOBILIARIO: 'Imóveis',
  OUTRO: 'Outro',
}

/**
 * BusinessCard — Stitch-aligned commercial tile.
 *
 * Simplified from the legacy rich card (Phone CTAs, premium badge, emoji fallbacks)
 * to a clean Guia Comercial tile: logo or initial + name + category label.
 * Plan 01-03 drops the inline CTAs because the home Guia Comercial row uses
 * static category tiles, and /anunciantes renders this as a secondary grid.
 */
export function BusinessCard({ name, logo, category, whatsapp, website, phone }: BusinessCardProps) {
  const href =
    whatsapp
      ? `https://wa.me/55${whatsapp.replace(/\D/g, '')}`
      : website || (phone ? `tel:${phone}` : '#')
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <a
      href={href}
      target={whatsapp || website ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group bg-white rounded-md shadow-sm p-4 flex flex-col items-center gap-2 text-on-surface hover:shadow-md transition-shadow"
    >
      <div className="relative w-16 h-16 overflow-hidden rounded-md bg-surface-container flex items-center justify-center">
        {logo ? (
          <Image src={logo} alt={name} fill sizes="64px" className="object-cover" />
        ) : (
          <span className="text-2xl font-headline font-black text-primary">{initial}</span>
        )}
      </div>
      <span className="font-bold text-sm text-center line-clamp-2 font-body group-hover:text-primary transition-colors">
        {name}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-outline font-label">
        {CATEGORY_LABELS[category] || category}
      </span>
    </a>
  )
}

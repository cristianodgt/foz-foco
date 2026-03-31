import Image from 'next/image'
import { Phone } from 'lucide-react'

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
  ALIMENTACAO: 'Alimentacao',
  SAUDE: 'Saude',
  SERVICOS: 'Servicos',
  EDUCACAO: 'Educacao',
  COMERCIO: 'Comercio',
  ESPORTES: 'Esportes',
  AUTOMOTIVO: 'Automotivo',
  IMOBILIARIO: 'Imoveis',
  OUTRO: 'Outro',
}

const CATEGORY_EMOJIS: Record<string, string> = {
  ALIMENTACAO: '🍽️',
  SAUDE: '🏥',
  SERVICOS: '🔧',
  EDUCACAO: '📚',
  COMERCIO: '🏪',
  ESPORTES: '⚽',
  AUTOMOTIVO: '🚗',
  IMOBILIARIO: '🏠',
  OUTRO: '💼',
}

export function BusinessCard({ name, logo, category, phone, whatsapp, website, isPremium }: BusinessCardProps) {
  const href = whatsapp
    ? `https://wa.me/55${whatsapp.replace(/\D/g, '')}`
    : website || (phone ? `tel:${phone}` : '#')

  return (
    <a
      href={href}
      target={whatsapp || website ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={`business-card ${isPremium ? 'business-card-premium' : ''}`}
    >
      {isPremium && (
        <span className="premium-badge" style={{ marginBottom: 2 }}>Premium</span>
      )}
      <div
        className="business-logo"
        style={{
          background: logo ? 'transparent' : 'var(--color-surface)',
        }}
      >
        {logo ? (
          <Image src={logo} alt={name} width={48} height={48} className="object-cover rounded-lg" />
        ) : (
          <span style={{ fontSize: 22 }}>{CATEGORY_EMOJIS[category] || '💼'}</span>
        )}
      </div>
      <span className="business-name line-clamp-2">{name}</span>
      <span className="business-category">{CATEGORY_LABELS[category] || category}</span>
      {(whatsapp || phone) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, color: 'var(--color-brand)', marginTop: 2 }}>
          <Phone size={10} />
          {whatsapp ? 'WhatsApp' : 'Ligar'}
        </span>
      )}
    </a>
  )
}

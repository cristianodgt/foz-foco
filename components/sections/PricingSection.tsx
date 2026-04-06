import Link from 'next/link'
import { Check } from 'lucide-react'

interface PricingSectionProps {
  variant?: 'home' | 'landing'
}

interface Tier {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Bronze',
    price: 'R$ 299/mês',
    features: [
      'Listagem no Guia Comercial',
      '1 post patrocinado/mês',
      'Botão WhatsApp direto',
      'Suporte por e-mail',
    ],
  },
  {
    name: 'Prata',
    price: 'R$ 699/mês',
    popular: true,
    features: [
      'Listagem destacada no Guia',
      '4 posts patrocinados/mês',
      'Banner 300×250 rotativo',
      'Métricas de impressões',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Ouro',
    price: 'R$ 1.999/mês',
    features: [
      'Destaque topo do Guia Comercial',
      'Posts patrocinados ilimitados',
      'Banner leaderboard 728×90',
      'Matéria editorial trimestral',
      'Gerente de conta dedicado',
    ],
  },
]

/**
 * PricingSection — 3-tier commercial offer on navy gradient.
 *
 * `variant="home"` — renders on the homepage below the commercial sections.
 * `variant="landing"` — reused on /anunciantes (plan 01-04) with the same tiers.
 *
 * Prices align with the existing /anunciantes values per RESEARCH §5 Q7:
 * R$ 299 / R$ 699 / R$ 1.999. Prata is the scaled "MAIS POPULAR" tier.
 */
export function PricingSection({ variant = 'home' }: PricingSectionProps) {
  const headline =
    variant === 'landing'
      ? 'Planos para cada tamanho de negócio'
      : 'Anuncie no Foz em Foco'
  const subhead =
    variant === 'landing'
      ? 'Escolha o plano ideal e apareça para quem realmente importa: o leitor local.'
      : 'Três planos para cada tamanho de negócio'

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary-container to-on-surface text-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">{headline}</h2>
          <p className="text-on-primary-container mt-3 font-label">{subhead}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-stretch">
          {TIERS.map(tier => {
            if (tier.popular) {
              return (
                <div
                  key={tier.name}
                  className="bg-white text-on-surface p-10 rounded-xl shadow-2xl md:transform md:scale-105 md:z-10 relative flex flex-col"
                >
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest font-label whitespace-nowrap">
                    MAIS POPULAR
                  </span>
                  <h3 className="text-xl font-bold text-primary font-label uppercase tracking-wider">
                    {tier.name}
                  </h3>
                  <p className="text-3xl md:text-4xl font-headline font-black text-primary mt-4">
                    {tier.price}
                  </p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/anunciantes"
                    className="mt-8 bg-primary text-white rounded-md py-3 font-bold text-xs uppercase tracking-widest text-center font-label hover:bg-primary-container transition-colors"
                  >
                    Contratar
                  </Link>
                </div>
              )
            }

            return (
              <div
                key={tier.name}
                className="bg-white/10 backdrop-blur-md p-10 rounded-xl border border-white/20 text-white flex flex-col"
              >
                <h3 className="text-xl font-bold font-label uppercase tracking-wider">
                  {tier.name}
                </h3>
                <p className="text-3xl md:text-4xl font-headline font-black mt-4">
                  {tier.price}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-tertiary-fixed shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/anunciantes"
                  className="mt-8 border border-white/40 rounded-md py-3 font-bold text-xs uppercase tracking-widest text-center font-label hover:bg-white/10 transition-colors"
                >
                  Contratar
                </Link>
              </div>
            )
          })}
        </div>

        <a
          href="https://wa.me/5545999999999"
          className="block text-center mt-10 text-tertiary-fixed-dim hover:underline text-sm font-label"
        >
          Falar com um consultor via WhatsApp →
        </a>
      </div>
    </section>
  )
}

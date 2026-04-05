import { Metadata } from 'next'
import {
  Users,
  Eye,
  MapPin,
  TrendingUp,
  Monitor,
  Smartphone,
  Megaphone,
  Newspaper,
  Globe,
  Mail,
  Phone,
  Instagram,
} from 'lucide-react'
import { PricingSection } from '@/components/sections/PricingSection'

export const metadata: Metadata = {
  title: 'Anuncie no Foz em Foco',
  description:
    'Alcance milhares de moradores de Foz do Iguaçu. Conheça nossos planos de publicidade e fale com nossa equipe.',
}

const stats = [
  { icon: Users, value: '80k+', label: 'Leitores únicos/mês' },
  { icon: Eye, value: '350k+', label: 'Visualizações/mês' },
  { icon: MapPin, value: '78%', label: 'Audiência local' },
  { icon: TrendingUp, value: '4:12', label: 'Tempo médio' },
]

const adFormats = [
  {
    icon: Monitor,
    name: 'Leaderboard',
    size: '728×90 px',
    badge: 'Destaque',
    description: 'Máxima visibilidade no topo da home e das editorias.',
    bullets: ['Primeira dobra desktop', 'Presente em todas as páginas', 'Ideal para awareness'],
  },
  {
    icon: Megaphone,
    name: 'Retângulo',
    size: '300×250 px',
    badge: 'Popular',
    description: 'Acompanha o leitor durante toda a leitura do conteúdo.',
    bullets: ['Integrado ao feed', 'Rotação automática', 'Alta taxa de cliques'],
  },
  {
    icon: Monitor,
    name: 'Half-page',
    size: '300×600 px',
    badge: null,
    description: 'Presença dominante na sidebar durante toda a navegação.',
    bullets: ['Sidebar sticky', 'Visibilidade prolongada', 'Formato premium'],
  },
  {
    icon: Smartphone,
    name: 'Mobile Banner',
    size: '320×50 px',
    badge: 'Mobile',
    description: 'Impacto direto no público mobile, que representa 72% dos acessos.',
    bullets: ['Otimizado para mobile', 'Entre seções de conteúdo', 'Leve e rápido'],
  },
  {
    icon: Newspaper,
    name: 'Card Patrocinado',
    size: 'Formato nativo',
    badge: null,
    description: 'Integrado ao fluxo de notícias, se mistura ao conteúdo editorial.',
    bullets: ['Layout editorial', 'A cada 4 artigos', 'Alta atenção do leitor'],
  },
  {
    icon: Globe,
    name: 'Vitrine Guia Comercial',
    size: 'Card permanente',
    badge: 'Local',
    description: 'Listagem fixa na seção "Guia Comercial" da home.',
    bullets: ['Presença contínua', 'Botão WhatsApp', 'SEO local'],
  },
]

const testimonials = [
  {
    quote:
      'Desde que começamos a anunciar no Foz em Foco, nosso movimento semanal aumentou consideravelmente. O público é realmente local.',
    author: 'Marcos R.',
    role: 'Restaurante Sabor da Terra',
  },
  {
    quote:
      'Os relatórios semanais nos ajudam a ajustar a campanha. Vale cada centavo investido.',
    author: 'Cláudia M.',
    role: 'Imobiliária Cataratas',
  },
  {
    quote:
      'Plano Prata é exatamente o que um negócio local precisa. Alcance certeiro sem gastar rios de dinheiro.',
    author: 'Rafael S.',
    role: 'Auto Peças Foz',
  },
]

export default function AnunciantesPage() {
  return (
    <>
      {/* 1. Hero editorial */}
      <section className="bg-surface py-20 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm font-label">
            Para Anunciantes
          </span>
          <h1 className="mt-6 font-headline text-5xl md:text-6xl font-bold text-on-surface leading-tight">
            Alcance quem <span className="italic text-primary">decide</span> em Foz do Iguaçu
          </h1>
          <p className="mt-6 text-lg text-outline max-w-2xl mx-auto font-body">
            O portal de notícias mais lido de Foz do Iguaçu coloca sua marca na
            frente de mais de 80 mil leitores locais todos os meses, com
            relatórios em tempo real e sem fidelidade.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5545999999999?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20no%20Foz%20em%20Foco"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-colors font-label"
            >
              Falar com um consultor
            </a>
            <a
              href="#planos"
              className="border-2 border-primary text-primary px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-colors font-label"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      {/* 2. Stats bar */}
      <section className="bg-on-surface text-surface py-12 px-4">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label}>
                <Icon className="w-8 h-8 mx-auto text-tertiary-fixed" />
                <p className="mt-3 text-3xl font-headline font-black text-surface">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-outline-variant mt-1 font-label">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Pricing — reuse PricingSection from plan 01-03 */}
      <div id="planos">
        <PricingSection variant="landing" />
      </div>

      {/* 4. 6 ad format tiles */}
      <section className="py-20 bg-surface-container-low px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-on-surface">
            Formatos disponíveis
          </h2>
          <p className="text-center text-outline mt-3 max-w-xl mx-auto font-body">
            Padrões IAB compatíveis com qualquer criativo. Escolha o formato
            que melhor se encaixa ao seu objetivo.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adFormats.map(fmt => {
              const Icon = fmt.icon
              return (
                <div
                  key={fmt.name}
                  className="bg-surface rounded-lg p-6 shadow-sm border border-outline-variant/50 flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-primary-container/10 text-primary rounded-md flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    {fmt.badge && (
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest font-label">
                        {fmt.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-headline font-bold text-on-surface">
                    {fmt.name}
                  </h3>
                  <p className="text-xs font-mono text-primary font-bold mt-1 tracking-wide">
                    {fmt.size}
                  </p>
                  <p className="mt-3 text-sm text-outline font-body leading-relaxed">
                    {fmt.description}
                  </p>
                  <ul className="mt-4 space-y-1 flex-1">
                    {fmt.bullets.map(b => (
                      <li
                        key={b}
                        className="text-xs text-outline font-label flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-tertiary-fixed shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-20 bg-surface px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-on-surface">
            Quem confia no Foz em Foco
          </h2>
          <p className="text-center text-outline mt-3 font-body">
            Empresas locais que crescem com a gente.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <figure
                key={t.author}
                className="bg-surface-container-lowest rounded-xl p-6 border-l-4 border-tertiary-fixed shadow-sm"
              >
                <blockquote className="text-on-surface italic font-body leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-outline-variant/50">
                  <p className="font-bold text-on-surface font-label">
                    {t.author}
                  </p>
                  <p className="text-xs text-outline uppercase tracking-widest font-label">
                    {t.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA in brand gradient */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary-container to-on-surface text-white text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-white">
            Pronto para anunciar?
          </h2>
          <p className="mt-4 text-lg text-on-primary-container font-body">
            Fale com um consultor e montamos o plano ideal para seu negócio em
            até 24h. Sem contrato de fidelidade.
          </p>
          <a
            href="https://wa.me/5545999999999?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20no%20Foz%20em%20Foco"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block bg-tertiary-fixed text-on-tertiary-fixed px-10 py-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors font-label"
          >
            Começar agora
          </a>
          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center text-sm text-on-primary-container font-label">
            <a
              href="https://wa.me/5545999999999"
              className="inline-flex items-center gap-2 hover:text-tertiary-fixed transition-colors"
            >
              <Phone className="w-4 h-4" /> (45) 99999-9999
            </a>
            <a
              href="mailto:publicidade@fozemfoco.com.br"
              className="inline-flex items-center gap-2 hover:text-tertiary-fixed transition-colors"
            >
              <Mail className="w-4 h-4" /> publicidade@fozemfoco.com.br
            </a>
            <a
              href="https://instagram.com/fozemfoco"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-tertiary-fixed transition-colors"
            >
              <Instagram className="w-4 h-4" /> @fozemfoco
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

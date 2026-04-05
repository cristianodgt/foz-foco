import { Metadata } from 'next'
import { Check, Phone, Mail, Instagram, TrendingUp, Users, Eye, MapPin } from 'lucide-react'
import { BusinessDirectory } from '@/components/ads/BusinessDirectory'

export const metadata: Metadata = {
  title: 'Anuncie no Foz em Foco',
  description: 'Alcance milhares de moradores de Foz do Iguaçu. Conheça nossos planos de publicidade e fale com nossa equipe.',
}

const stats = [
  { icon: Users, value: '80 mil+', label: 'Leitores mensais' },
  { icon: Eye, value: '350 mil', label: 'Pageviews/mês' },
  { icon: MapPin, value: '78%', label: 'Público local' },
  { icon: TrendingUp, value: '4,2 min', label: 'Tempo médio' },
]

const plans = [
  {
    name: 'Bronze',
    price: '299',
    period: '/mês',
    tagline: 'Para começar a ser visto',
    features: [
      'Vitrine de estabelecimento',
      'Logo + WhatsApp + endereço',
      '1 card patrocinado/mês',
      'Relatório mensal básico',
      'Suporte por WhatsApp',
    ],
    popular: false,
    cta: 'Começar agora',
  },
  {
    name: 'Prata',
    price: '699',
    period: '/mês',
    tagline: 'O plano mais escolhido',
    features: [
      'Tudo do plano Bronze',
      'Banner Sidebar 300×250 rotativo',
      '4 cards patrocinados/mês',
      'Patrocinador de 1 editoria',
      'Arte criativa inclusa',
      'Relatório semanal detalhado',
    ],
    popular: true,
    cta: 'Escolher Prata',
  },
  {
    name: 'Ouro',
    price: '1.499',
    period: '/mês',
    tagline: 'Máxima exposição',
    features: [
      'Tudo do plano Prata',
      'Banner Topo 970×90 (home)',
      'Banner Inline em todos os posts',
      'Patrocinador de 3 editorias',
      'Destaque na newsletter semanal',
      'Gerente de conta dedicado',
    ],
    popular: false,
    cta: 'Falar com consultor',
  },
]

const adFormats = [
  { name: 'Banner Topo', size: '970×90px', description: 'Máxima visibilidade no topo de todas as páginas.', badge: 'Destaque' },
  { name: 'Sidebar 300×250', size: '300×250px', description: 'Acompanha o leitor durante toda a leitura.', badge: 'Popular' },
  { name: 'Card Patrocinado', size: 'Nativo', description: 'Integrado ao fluxo de notícias, a cada 4 artigos.', badge: null },
  { name: 'Patrocinador de Seção', size: 'Logo + nome', description: '"Patrocinado por [Sua Empresa]" no cabeçalho da editoria.', badge: 'Premium' },
  { name: 'Banner Inline', size: '728×90px', description: 'Entre seções de conteúdo. Alta visualização.', badge: null },
  { name: 'Vitrine Local', size: 'Card permanente', description: 'Listagem na seção "Parceiros Locais" da home.', badge: 'Local' },
]

const benefits = [
  'Público 100% local de Foz do Iguaçu e região',
  'Rastreamento de impressões e cliques em tempo real',
  'Relatórios de desempenho detalhados',
  'Criação de arte inclusa nos planos Prata e Ouro',
  'Sem contrato de fidelidade obrigatório',
  'Suporte dedicado via WhatsApp',
]

const testimonials = [
  {
    quote: 'Desde que começamos a anunciar no Foz em Foco, nosso movimento semanal aumentou consideravelmente. O público é realmente local.',
    author: 'Marcos R.',
    role: 'Restaurante Sabor da Terra',
  },
  {
    quote: 'Os relatórios semanais nos ajudam a ajustar a campanha. Vale cada centavo investido.',
    author: 'Cláudia M.',
    role: 'Imobiliária Cataratas',
  },
  {
    quote: 'Plano Prata é exatamente o que um negócio local precisa. Alcance certeiro sem gastar rios de dinheiro.',
    author: 'Rafael S.',
    role: 'Auto Peças Foz',
  },
]

export default function AnunciantesPage() {
  return (
    <div className="container-editorial" style={{ paddingTop: 40, paddingBottom: 72 }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--color-accent)',
          color: '#1A1A2E',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: 100,
          marginBottom: 20,
        }}>
          Publicidade local que funciona
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 800,
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
          lineHeight: 1.05,
          marginBottom: 18,
          maxWidth: 820,
          margin: '0 auto 18px',
        }}>
          Conecte seu negócio a <span style={{ color: 'var(--color-brand)' }}>milhares</span> de moradores de Foz
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--color-text-2)',
          maxWidth: 640,
          margin: '0 auto 32px',
          lineHeight: 1.55,
        }}>
          Formatos flexíveis para todos os orçamentos. Do pequeno comércio de bairro à grande marca regional.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/554599999999?text=Olá!%20Gostaria%20de%20anunciar%20no%20Foz%20em%20Foco"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-accent)',
              color: '#1A1A2E',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '15px 34px',
              borderRadius: 100,
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(245,166,35,0.35)',
              letterSpacing: 0.3,
            }}
          >
            Falar no WhatsApp →
          </a>
          <a
            href="#planos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'transparent',
              color: 'var(--color-brand)',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '15px 28px',
              borderRadius: 100,
              textDecoration: 'none',
              border: '1.5px solid var(--color-brand)',
            }}
          >
            Ver planos
          </a>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        padding: '28px 16px',
        marginBottom: 72,
        boxShadow: '0 4px 24px rgba(15,76,129,0.06)',
      }} className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid var(--color-border)' : 'none',
            padding: '4px 8px',
          }} className="stat-item">
            <s.icon size={20} style={{ color: 'var(--color-accent)', marginBottom: 8 }} />
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)',
              color: 'var(--color-brand)',
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* PLANOS */}
      <div id="planos" style={{ textAlign: 'center', marginBottom: 36 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Planos mensais
        </span>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
          color: 'var(--color-text)',
          letterSpacing: '-0.015em',
          marginTop: 8,
          marginBottom: 10,
        }}>
          Escolha o plano ideal para seu negócio
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Sem fidelidade. Cancele quando quiser.
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        marginBottom: 80,
        alignItems: 'stretch',
      }} className="plans-grid">
        {plans.map(plan => (
          <div
            key={plan.name}
            style={{
              background: 'var(--color-bg)',
              border: plan.popular ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
              borderRadius: 16,
              padding: '36px 28px 32px',
              position: 'relative',
              boxShadow: plan.popular
                ? '0 12px 40px rgba(245,166,35,0.18)'
                : '0 2px 12px rgba(0,0,0,0.04)',
              transform: plan.popular ? 'scale(1.03)' : 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="plan-card"
          >
            {plan.popular && (
              <span style={{
                position: 'absolute',
                top: -13,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--color-accent)',
                color: '#1A1A2E',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: 'uppercase',
                padding: '6px 16px',
                borderRadius: 100,
                whiteSpace: 'nowrap',
              }}>
                Mais escolhido
              </span>
            )}
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 8,
            }}>
              {plan.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-2)', marginBottom: 18 }}>
              {plan.tagline}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-2)' }}>R$</span>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 800,
                fontSize: '3rem',
                color: 'var(--color-brand)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {plan.price}
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{plan.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9rem', color: 'var(--color-text-2)', lineHeight: 1.5 }}>
                  <Check size={16} color="var(--color-accent)" strokeWidth={3} style={{ marginTop: 2, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/554599999999?text=Olá!%20Tenho%20interesse%20no%20plano%20"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                background: plan.popular ? 'var(--color-accent)' : 'transparent',
                color: plan.popular ? '#1A1A2E' : 'var(--color-brand)',
                border: plan.popular ? '2px solid var(--color-accent)' : '2px solid var(--color-brand)',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '13px 24px',
                borderRadius: 100,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* BENEFÍCIOS */}
      <div style={{
        background: 'var(--color-brand-light)',
        borderRadius: 16,
        padding: '40px 44px',
        marginBottom: 72,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: '1.8rem',
          letterSpacing: '-0.01em',
          marginBottom: 24,
          color: 'var(--color-text)',
        }}>
          Por que anunciar conosco?
        </h2>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 32px', listStyle: 'none', padding: 0 }} className="benefits-list">
          {benefits.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.94rem', color: 'var(--color-text-2)', lineHeight: 1.5 }}>
              <div style={{
                background: 'var(--color-brand)',
                color: '#fff',
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
                <Check size={13} strokeWidth={3} />
              </div>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* FORMATOS */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.015em',
        marginBottom: 10,
        color: 'var(--color-text)',
      }}>
        Formatos disponíveis
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: '0.95rem' }}>
        Padrões IAB compatíveis com qualquer criativo.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 72 }} className="formats-grid">
        {adFormats.map(fmt => (
          <div key={fmt.name} className="article-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>{fmt.name}</h3>
              {fmt.badge && (
                <span style={{
                  background: 'var(--color-accent)',
                  color: '#1A1A2E',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 100,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {fmt.badge}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand)', marginBottom: 10, fontFamily: 'monospace' }}>{fmt.size}</p>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-2)', lineHeight: 1.55 }}>{fmt.description}</p>
          </div>
        ))}
      </div>

      {/* DEPOIMENTOS */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.015em',
        marginBottom: 28,
        color: 'var(--color-text)',
      }}>
        O que dizem nossos anunciantes
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 72 }} className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 14,
            padding: '26px 26px 22px',
            position: 'relative',
          }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '3.5rem',
              color: 'var(--color-accent)',
              lineHeight: 0.5,
              marginBottom: 6,
              marginTop: 6,
            }}>
              “
            </div>
            <p style={{
              fontSize: '0.92rem',
              color: 'var(--color-text-2)',
              lineHeight: 1.6,
              marginBottom: 18,
              fontStyle: 'italic',
            }}>
              {t.quote}
            </p>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)' }}>{t.author}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA CONTATO FINAL */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)',
        borderRadius: 16,
        padding: '48px 44px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 28,
        marginBottom: 72,
        boxShadow: '0 12px 40px rgba(15,76,129,0.2)',
      }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '2.2rem',
            letterSpacing: '-0.015em',
            marginBottom: 10,
            lineHeight: 1.1,
          }}>
            Pronto para começar?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1rem', marginBottom: 20 }}>
            Fale com nossa equipe e receba uma proposta personalizada em até 24h.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="https://wa.me/554599999999" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none' }}>
              <Phone size={15} /> (45) 9999-9999
            </a>
            <a href="mailto:publicidade@fozemfoco.com.br" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none' }}>
              <Mail size={15} /> publicidade@fozemfoco.com.br
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none' }}>
              <Instagram size={15} /> @fozemfoco
            </a>
          </div>
        </div>
        <a
          href="https://wa.me/554599999999?text=Olá!%20Gostaria%20de%20anunciar%20no%20Foz%20em%20Foco"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--color-accent)',
            color: '#1A1A2E',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '16px 36px',
            borderRadius: 100,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 8px 24px rgba(245,166,35,0.4)',
            letterSpacing: 0.3,
          }}
        >
          Solicitar proposta →
        </a>
      </div>

      {/* PARCEIROS ATUAIS */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.015em',
        marginBottom: 28,
        color: 'var(--color-text)',
      }}>
        Nossos parceiros
      </h2>
      <BusinessDirectory />

      <style>{`
        @media (max-width: 1024px) {
          .formats-grid, .testimonials-grid, .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .plan-card { transform: none !important; }
          .stats-bar { grid-template-columns: repeat(2, 1fr) !important; gap: 20px 0 !important; }
          .stats-bar .stat-item:nth-child(2) { border-right: none !important; }
        }
        @media (max-width: 768px) {
          .benefits-list { grid-template-columns: 1fr !important; }
          .formats-grid, .testimonials-grid, .plans-grid { grid-template-columns: 1fr !important; }
          .stats-bar { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { Check, Phone, Mail, Instagram } from 'lucide-react'
import { BusinessDirectory } from '@/components/ads/BusinessDirectory'

export const metadata: Metadata = {
  title: 'Anuncie no Foz em Foco',
  description: 'Alcance milhares de moradores de Foz do Iguaçu. Conheça nossos formatos de publicidade e fale com nossa equipe.',
}

const adFormats = [
  {
    name: 'Banner Topo',
    size: '970×90px',
    description: 'Máxima visibilidade no topo de todas as páginas. Exibido antes do conteúdo principal.',
    badge: 'Destaque',
  },
  {
    name: 'Sidebar 300×250',
    size: '300×250px',
    description: 'Acompanha o leitor durante toda a leitura. Rotativo — seu anúncio aparece automaticamente.',
    badge: 'Popular',
  },
  {
    name: 'Card Patrocinado',
    size: 'Nativo',
    description: 'Integrado ao fluxo de notícias. Aparece a cada 4 artigos no grid principal.',
    badge: null,
  },
  {
    name: 'Patrocinador de Seção',
    size: 'Logo + nome',
    description: '"Patrocinado por [Sua Empresa]" no cabeçalho de uma editoria. Alta associação de marca.',
    badge: 'Premium',
  },
  {
    name: 'Banner Inline',
    size: '728×90px',
    description: 'Inserido entre as seções de conteúdo. Alta taxa de visualização.',
    badge: null,
  },
  {
    name: 'Vitrine de Estabelecimento',
    size: 'Card permanente',
    description: 'Seu negócio listado na seção "Parceiros Locais" da homepage com logo, contato e WhatsApp.',
    badge: 'Local',
  },
]

const benefits = [
  'Público local — moradores e visitantes de Foz do Iguaçu',
  'Rastreamento de impressões e cliques em tempo real',
  'Relatórios mensais de desempenho',
  'Criação de arte incluída nos planos anuais',
  'Sem contrato mínimo obrigatório',
  'Suporte dedicado via WhatsApp',
]

export default function AnunciantesPage() {
  return (
    <div className="container-editorial" style={{ paddingTop: 32, paddingBottom: 64 }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '0.04em', color: 'var(--color-brand)', marginBottom: 16 }}>
          Anuncie no Foz em Foco
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto 28px' }}>
          Conecte seu negócio a milhares de moradores de Foz do Iguaçu. Formatos flexíveis, investimento acessível.
        </p>
        <a
          href="https://wa.me/554599999999?text=Olá!%20Gostaria%20de%20anunciar%20no%20Foz%20em%20Foco"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'var(--color-brand)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '14px 32px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Falar com nossa equipe →
        </a>
      </div>

      {/* Benefícios */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: '32px 36px', marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 24, color: 'var(--color-text-primary)' }}>
          Por que anunciar conosco?
        </h2>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 32px', listStyle: 'none', padding: 0 }} className="benefits-list">
          {benefits.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              <Check size={16} color="var(--color-brand)" style={{ marginTop: 2, flexShrink: 0 }} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Formatos */}
      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.05em', marginBottom: 28, color: 'var(--color-text-primary)' }}>
        Formatos disponíveis
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 64 }} className="formats-grid">
        {adFormats.map(fmt => (
          <div key={fmt.name} className="article-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{fmt.name}</h3>
              {fmt.badge && (
                <span style={{ background: 'var(--color-brand)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em' }}>
                  {fmt.badge}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-brand)', marginBottom: 8, fontFamily: 'monospace' }}>{fmt.size}</p>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{fmt.description}</p>
          </div>
        ))}
      </div>

      {/* Contato */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-brand), #c0392b)', borderRadius: 12, padding: '40px 36px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, marginBottom: 64 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.05em', marginBottom: 8 }}>Pronto para começar?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>Fale com nossa equipe e receba uma proposta personalizada.</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            <a href="https://wa.me/554599999999" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              <Phone size={14} /> WhatsApp
            </a>
            <a href="mailto:publicidade@fozemfoco.com.br" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              <Mail size={14} /> E-mail
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              <Instagram size={14} /> Instagram
            </a>
          </div>
        </div>
        <a
          href="https://wa.me/554599999999?text=Olá!%20Gostaria%20de%20anunciar%20no%20Foz%20em%20Foco"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#fff',
            color: 'var(--color-brand)',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '14px 32px',
            borderRadius: 8,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          Solicitar proposta →
        </a>
      </div>

      {/* Parceiros atuais */}
      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.05em', marginBottom: 28, color: 'var(--color-text-primary)' }}>
        Nossos parceiros
      </h2>
      <BusinessDirectory />

      <style>{`
        @media (max-width: 768px) {
          .benefits-list { grid-template-columns: 1fr !important; }
          .formats-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .formats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

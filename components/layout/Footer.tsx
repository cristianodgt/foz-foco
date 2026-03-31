import Link from 'next/link'
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react'

const categories = [
  { name: 'Cidade', slug: 'cidade' },
  { name: 'Política', slug: 'politica' },
  { name: 'Economia', slug: 'economia' },
  { name: 'Esportes', slug: 'esportes' },
  { name: 'Cultura', slug: 'cultura' },
  { name: 'Eventos', slug: 'eventos' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container-editorial">
        {/* CTA Publicidade */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-brand), #c0392b)',
          borderRadius: 12,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 48
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: '#fff', letterSpacing: '0.05em', marginBottom: 4 }}>
              Anuncie no Foz em Foco
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              Alcance milhares de moradores de Foz do Iguaçu. Formatos para todos os orçamentos.
            </p>
          </div>
          <Link
            href="/anunciantes"
            style={{
              background: '#fff',
              color: 'var(--color-brand)',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '12px 28px',
              borderRadius: 8,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            Quero anunciar →
          </Link>
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 40 }} className="footer-grid">
          {/* Marca */}
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'var(--color-brand)', marginBottom: 12 }}>
              FOZ EM FOCO
            </div>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.7, color: 'var(--color-text-muted)', maxWidth: 240 }}>
              O portal de notícias de Foz do Iguaçu e região. Informação local, sempre em foco.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--color-text-muted)' }}>
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--color-text-muted)' }}>
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: 'var(--color-text-muted)' }}>
                <Youtube size={18} />
              </a>
              <a href="mailto:contato@fozemfoco.com.br" aria-label="E-mail" style={{ color: 'var(--color-text-muted)' }}>
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Editorias */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
              Editorias
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.map(c => (
                <li key={c.slug}>
                  <Link href={`/categoria/${c.slug}`} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
              Institucional
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Sobre nós', href: '/sobre' },
                { label: 'Anuncie aqui', href: '/anunciantes' },
                { label: 'Contato', href: '/contato' },
                { label: 'Política de privacidade', href: '/privacidade' },
                { label: 'Termos de uso', href: '/termos' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
            © {year} Foz em Foco. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
            Foz do Iguaçu — Paraná — Brasil
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </footer>
  )
}

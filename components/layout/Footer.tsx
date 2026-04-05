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
        {/* CTA Publicidade — âmbar comercial */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
          borderRadius: 14,
          padding: '32px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 56,
          boxShadow: '0 10px 40px rgba(245,166,35,0.22)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2rem', color: '#1A1A2E', letterSpacing: '-0.015em', marginBottom: 6, lineHeight: 1.15 }}>
              Anuncie no Foz em Foco
            </h2>
            <p style={{ color: 'rgba(26,26,46,0.82)', fontSize: '0.92rem', fontWeight: 500 }}>
              Alcance milhares de moradores de Foz do Iguaçu. Formatos para todos os orçamentos.
            </p>
          </div>
          <Link
            href="/anunciantes"
            style={{
              background: '#1A1A2E',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.92rem',
              padding: '14px 32px',
              borderRadius: 100,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              letterSpacing: 0.2,
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            }}
          >
            Quero anunciar →
          </Link>
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 40 }} className="footer-grid">
          {/* Marca */}
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.9rem', letterSpacing: '0.1em', color: '#fff', marginBottom: 14 }}>
              FOZ <span style={{ color: 'var(--color-accent)' }}>EM</span> FOCO
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#9BA3C0', maxWidth: 260 }}>
              O portal de notícias de Foz do Iguaçu e região. Informação local, sempre em foco.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#9BA3C0', transition: 'color 0.15s' }} className="footer-social">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#9BA3C0' }} className="footer-social">
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: '#9BA3C0' }} className="footer-social">
                <Youtube size={18} />
              </a>
              <a href="mailto:contato@fozemfoco.com.br" aria-label="E-mail" style={{ color: '#9BA3C0' }} className="footer-social">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Editorias */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: 18 }}>
              Editorias
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.map(c => (
                <li key={c.slug}>
                  <Link href={`/categoria/${c.slug}`} style={{ fontSize: '0.875rem', color: '#C4CAE0', textDecoration: 'none', fontWeight: 500 }}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: 18 }}>
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
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: '#C4CAE0', textDecoration: 'none', fontWeight: 500 }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: '#7C849E' }}>
            © {year} Foz em Foco. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '0.78rem', color: '#7C849E' }}>
            Foz do Iguaçu — Paraná — Brasil
          </p>
        </div>
      </div>

      <style>{`
        .footer-social { transition: color 0.15s, transform 0.15s; }
        .footer-social:hover { color: var(--color-accent) !important; transform: translateY(-2px); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </footer>
  )
}

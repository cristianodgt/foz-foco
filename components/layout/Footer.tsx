import Link from 'next/link'
import { Facebook, Instagram, Youtube } from 'lucide-react'

// Mirrors desktop.html Row 11 — navy 4-col editorial footer (Brand / Editorial
// / Institucional / Newsletter) with a bottom bar. No amber gradient CTA card
// (that lives in the Pricing section, plan 01-03).
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-on-surface text-surface py-20 px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Col 1 — Brand */}
        <div>
          <h2 className="text-2xl font-black font-headline text-on-primary-container tracking-tighter">
            FOZ EM FOCO
          </h2>
          <p className="text-sm text-outline-variant mt-2">
            O portal de notícias de Foz do Iguaçu
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-outline-variant hover:text-on-primary-container transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-outline-variant hover:text-on-primary-container transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-outline-variant hover:text-on-primary-container transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2 — Editorial */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-on-primary-container mb-4">
            Editorial
          </h3>
          <ul className="space-y-3 text-sm text-outline-variant">
            <li>
              <Link href="/categoria/cidade" className="hover:text-on-primary-container transition-colors">
                Cidades
              </Link>
            </li>
            <li>
              <Link href="/categoria/politica" className="hover:text-on-primary-container transition-colors">
                Política
              </Link>
            </li>
            <li>
              <Link href="/categoria/economia" className="hover:text-on-primary-container transition-colors">
                Economia
              </Link>
            </li>
            <li>
              <Link href="/categoria/esportes" className="hover:text-on-primary-container transition-colors">
                Esporte
              </Link>
            </li>
            <li>
              <Link href="/categoria/cultura" className="hover:text-on-primary-container transition-colors">
                Cultura
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 — Institucional */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-on-primary-container mb-4">
            Institucional
          </h3>
          <ul className="space-y-3 text-sm text-outline-variant">
            <li>
              <Link href="/sobre" className="hover:text-on-primary-container transition-colors">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/expediente" className="hover:text-on-primary-container transition-colors">
                Expediente
              </Link>
            </li>
            <li>
              <Link href="/anunciantes" className="hover:text-on-primary-container transition-colors">
                Anuncie
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:text-on-primary-container transition-colors">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-on-primary-container transition-colors">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-on-primary-container mb-4">
            Newsletter
          </h3>
          <p className="text-sm text-outline-variant">
            Receba as principais notícias de Foz direto no seu e-mail.
          </p>
          <form action="#" method="post" className="mt-4">
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              required
              className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm w-full text-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-on-primary-container"
            />
            <button
              type="submit"
              className="mt-3 bg-on-primary-container text-on-primary-fixed px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest w-full hover:brightness-95 transition-all"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1200px] mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-widest text-outline-variant">
        <span>© {year} Foz em Foco. Todos os direitos reservados.</span>
        <span>Feito em Foz do Iguaçu</span>
      </div>
    </footer>
  )
}

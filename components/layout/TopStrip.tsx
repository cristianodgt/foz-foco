import { Globe, Share2, Mail, Sun } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Desktop-only top strip — mirrors Stitch desktop.html Row 1
// (date + location + weather placeholder + social icons)
export function TopStrip() {
  const today = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="hidden md:block bg-on-surface text-surface">
      <div className="max-w-[1200px] mx-auto h-8 px-4 flex items-center justify-between text-[11px] font-label tracking-wider uppercase font-medium">
        <div className="flex items-center gap-3">
          <span className="capitalize">{today}</span>
          <span className="opacity-40">|</span>
          <span>Foz do Iguaçu - PR</span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <Sun className="w-3 h-3" />
            28°C
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" aria-label="Site" className="hover:text-on-tertiary-container transition-colors">
            <Globe className="w-3 h-3" />
          </a>
          <a href="#" aria-label="Compartilhar" className="hover:text-on-tertiary-container transition-colors">
            <Share2 className="w-3 h-3" />
          </a>
          <a href="mailto:contato@fozemfoco.com.br" aria-label="E-mail" className="hover:text-on-tertiary-container transition-colors">
            <Mail className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

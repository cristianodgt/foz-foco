// TODO(future): wire to events DB model when available.
// Currently a static placeholder per plan 01-03 (user directive #3).

import { MapPin } from 'lucide-react'

interface PlaceholderEvent {
  day: string
  month: string
  title: string
  venue: string
}

const EVENTS: PlaceholderEvent[] = [
  { day: '15', month: 'MAR', title: 'Festival de Cataratas', venue: 'Parque Nacional do Iguaçu' },
  { day: '22', month: 'MAR', title: 'Feira Gastronômica', venue: 'Gramadão da Vila A' },
  { day: '05', month: 'ABR', title: 'Corrida das Três Fronteiras', venue: 'Orla do Lago Itaipu' },
]

/**
 * EventsScroller — horizontal scroll strip mirroring Stitch desktop.html Row 7.
 *
 * Premium editorial styling: rounded-2xl cards, layered shadows, hover lift,
 * richer gradient, polished date badge with ring.
 */
export function EventsScroller() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-inverse-surface/5">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-10 px-4 text-on-surface">
          Agenda de Eventos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
          {EVENTS.map(ev => (
            <div
              key={ev.title}
              className="group"
            >
              <div className="relative h-[360px] md:h-[400px] rounded-2xl bg-gradient-to-br from-primary-container via-primary/80 to-on-surface overflow-hidden shadow-[0_4px_20px_-6px_rgba(26,26,46,0.2)] ring-1 ring-on-surface/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-8px_rgba(26,26,46,0.35)] group-hover:ring-on-surface/20">
                {/* Subtle inner shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10" />

                {/* Date badge */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-surface/95 backdrop-blur-sm px-4 py-2.5 rounded-xl min-w-[60px] text-center shadow-lg ring-1 ring-on-surface/10">
                  <span className="text-2xl font-black block font-headline text-on-surface leading-none">
                    {ev.day}
                  </span>
                  <span className="text-[10px] uppercase text-primary font-bold tracking-wider font-label mt-0.5 block">
                    {ev.month}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-headline font-bold text-xl text-on-surface group-hover:text-primary transition-colors">
                  {ev.title}
                </h3>
                <p className="text-sm text-outline font-label flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/60" />
                  {ev.venue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

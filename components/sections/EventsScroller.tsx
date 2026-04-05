// TODO(future): wire to events DB model when available.
// Currently a static placeholder per plan 01-03 (user directive #3).

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
  { day: '18', month: 'ABR', title: 'Show na Praça', venue: 'Praça da Paz' },
]

/**
 * EventsScroller — static placeholder mirroring Stitch desktop.html Row 7.
 *
 * Horizontal scroll strip of upcoming events. Content is hardcoded until a
 * real Events model exists. The scrollbar-hide utility is provided by
 * globals.css (installed in plan 01-01).
 */
export function EventsScroller() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-10 px-4 text-on-surface">
          Agenda de Eventos
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-8 px-4 scrollbar-hide">
          {EVENTS.map(ev => (
            <div key={ev.title} className="flex-none w-[280px] md:w-[300px]">
              <div className="relative h-[360px] md:h-[400px] rounded-xl bg-gradient-to-br from-primary-container via-primary to-on-surface overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-md min-w-[56px] text-center shadow-md">
                  <span className="text-2xl font-black block font-headline text-on-surface leading-none">
                    {ev.day}
                  </span>
                  <span className="text-[10px] uppercase text-primary font-bold tracking-wider font-label">
                    {ev.month}
                  </span>
                </div>
              </div>
              <h3 className="font-headline font-bold text-xl mt-3 text-on-surface">
                {ev.title}
              </h3>
              <p className="text-sm text-outline font-label">{ev.venue}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

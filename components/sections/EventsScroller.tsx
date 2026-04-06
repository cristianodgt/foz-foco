'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface PlaceholderEvent {
  day: string
  month: string
  title: string
  venue: string
  image: string
}

const EVENTS: PlaceholderEvent[] = [
  { day: '15', month: 'MAR', title: 'Festival de Cataratas', venue: 'Parque Nacional do Iguaçu', image: '/seed/events/event-1.jpeg' },
  { day: '22', month: 'MAR', title: 'Feira Gastronômica', venue: 'Gramadão da Vila A', image: '/seed/events/event-2.jpeg' },
  { day: '05', month: 'ABR', title: 'Corrida das Três Fronteiras', venue: 'Orla do Lago Itaipu', image: '/seed/events/event-3.jpeg' },
]

export function EventsScroller() {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(i => (i - 1 + EVENTS.length) % EVENTS.length)
  const next = () => setCurrent(i => (i + 1) % EVENTS.length)

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-inverse-surface/5">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
            Agenda de Eventos
          </h2>
          {/* Discrete nav arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface/60 hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface/60 hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {EVENTS.map((ev, i) => {
            const offset = (i - current + EVENTS.length) % EVENTS.length
            return (
              <motion.div
                key={ev.title}
                animate={{ opacity: offset === 0 ? 1 : 0.5, scale: offset === 0 ? 1 : 0.97 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <div className="relative h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow-[0_4px_20px_-6px_rgba(26,26,46,0.2)] ring-1 ring-on-surface/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-8px_rgba(26,26,46,0.35)]">
                  <Image
                    src={ev.image}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent" />
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl text-center shadow-lg ring-1 ring-on-surface/10 min-w-[52px]">
                    <span className="text-xl font-black block font-headline text-on-surface leading-none">{ev.day}</span>
                    <span className="text-[9px] uppercase text-primary font-bold tracking-wider font-label mt-0.5 block">{ev.month}</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-outline font-label flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary/60" />
                    {ev.venue}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Discrete dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {EVENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-primary w-5' : 'bg-on-surface/20 w-1.5'}`}
              aria-label={`Evento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

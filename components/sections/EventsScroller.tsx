'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const CARD_W = 280
const CARD_OFFSET = 310

export function EventsScroller() {
  const [current, setCurrent] = useState(0)
  const total = EVENTS.length

  const prev = () => setCurrent(i => (i - 1 + total) % total)
  const next = () => setCurrent(i => (i + 1) % total)

  // Compute per-card transform properties
  function getCardStyle(i: number) {
    let pos = i - current
    // Wrap around for circular behavior
    if (pos < -Math.floor(total / 2)) pos += total
    else if (pos > Math.floor(total / 2)) pos -= total

    const x = pos * CARD_OFFSET
    const y = pos === 0 ? -16 : 0
    const scale = pos === 0 ? 1.04 : 0.92
    const opacity = Math.abs(pos) > 1 ? 0 : pos === 0 ? 1 : 0.55
    const zIndex = pos === 0 ? 10 : 5 - Math.abs(pos)
    return { x, y, scale, opacity, zIndex }
  }

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-inverse-surface/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-12 md:mb-16">
          Agenda de Eventos
        </h2>

        {/* Card fan */}
        <div className="relative flex items-center justify-center" style={{ height: 400 }}>
          {EVENTS.map((ev, i) => {
            const { x, y, scale, opacity, zIndex } = getCardStyle(i)
            return (
              <motion.div
                key={ev.title}
                animate={{ x, y, scale, opacity }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex, position: 'absolute', width: CARD_W }}
                className="group"
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl shadow-[0_8px_40px_-10px_rgba(26,26,46,0.3)] ring-1 ring-on-surface/10 bg-surface-container cursor-pointer transition-shadow duration-300 group-hover:shadow-[0_20px_60px_-12px_rgba(26,26,46,0.45)]">
                  {/* Image */}
                  <div className="relative w-full" style={{ height: 340 }}>
                    <Image
                      src={ev.image}
                      alt={ev.title}
                      fill
                      sizes="280px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Date badge top-left */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl text-center shadow-lg ring-1 ring-on-surface/10 min-w-[52px]">
                    <span className="text-xl font-black block font-headline text-on-surface leading-none">{ev.day}</span>
                    <span className="text-[9px] uppercase text-primary font-bold tracking-wider font-label mt-0.5 block">{ev.month}</span>
                  </div>

                  {/* Glassmorphic bottom overlay */}
                  <div className="absolute bottom-4 left-3 right-3 transition-all duration-300 group-hover:-translate-y-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 shadow-md ring-1 ring-white/20">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-headline font-bold text-sm text-on-surface leading-snug line-clamp-2">
                        {ev.title}
                      </h3>
                      <p className="text-[11px] text-outline font-label flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
                        {ev.venue}
                      </p>
                      <div className="flex justify-end mt-1.5">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-container/70 ring-1 ring-on-surface/10 transition-all duration-300 group-hover:bg-primary group-hover:ring-primary">
                          <ArrowUpRight className="w-3.5 h-3.5 text-on-surface/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Nav arrows — bottom right */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={prev}
            className="p-2 rounded-full border border-on-surface/15 bg-white dark:bg-inverse-surface/10 shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all duration-200"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="p-2 rounded-full border border-on-surface/15 bg-white dark:bg-inverse-surface/10 shadow-sm hover:scale-110 hover:border-primary hover:text-primary transition-all duration-200"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
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

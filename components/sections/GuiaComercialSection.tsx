'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  UtensilsCrossed, Bed, ShoppingBag, HeartPulse, Wrench,
  GraduationCap, Home, Car, Camera, Dumbbell, Scissors, Plane,
  type LucideIcon,
} from 'lucide-react'

interface Tile {
  label: string
  href: string
  Icon: LucideIcon
  color: string
  bg: string
}

const TILES: Tile[] = [
  { label: 'Restaurantes', href: '/categoria/gastronomia', Icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Hotéis', href: '/categoria/turismo', Icon: Bed, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Compras', href: '/categoria/comercio', Icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Saúde', href: '/categoria/saude', Icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'Serviços', href: '/categoria/servicos', Icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-50' },
  { label: 'Educação', href: '/categoria/educacao', Icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Imóveis', href: '/categoria/imoveis', Icon: Home, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Veículos', href: '/categoria/veiculos', Icon: Car, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Turismo', href: '/categoria/turismo', Icon: Camera, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Esportes', href: '/categoria/esportes', Icon: Dumbbell, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Beleza', href: '/categoria/beleza', Icon: Scissors, color: 'text-pink-500', bg: 'bg-pink-50' },
  { label: 'Viagens', href: '/categoria/viagens', Icon: Plane, color: 'text-sky-500', bg: 'bg-sky-50' },
]

export function GuiaComercialSection() {
  return (
    <section className="bg-gradient-to-b from-surface-container/60 to-surface py-8 md:py-10">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface px-4 mb-8">
          Guia Comercial
        </h2>

        {/* Horizontal scroll with fade edges */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory">
            {TILES.map(({ label, href, Icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex-none snap-start"
              >
                <Link
                  href={href}
                  className="group flex flex-col items-center gap-3 w-[100px] md:w-[112px] p-4 rounded-2xl bg-white dark:bg-inverse-surface/10 shadow-[0_2px_12px_-4px_rgba(26,26,46,0.08)] ring-1 ring-on-surface/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_-6px_rgba(26,26,46,0.18)] hover:ring-on-surface/10"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.75} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-center text-on-surface/80 font-label leading-tight">
                    {label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { Share2 } from 'lucide-react'

export function ShareButton({ title }: { title: string }) {
  return (
    <button
      onClick={() => {
        if (typeof navigator !== 'undefined' && navigator.share) {
          navigator.share({ title, url: window.location.href })
        } else if (typeof navigator !== 'undefined') {
          navigator.clipboard.writeText(window.location.href)
        }
      }}
      className="ml-auto flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors text-sm"
    >
      <Share2 className="w-4 h-4" /> Compartilhar
    </button>
  )
}

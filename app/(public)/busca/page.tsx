'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ChevronLeft, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

function useSearch(query: string) {
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.data || [])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, isLoading }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { results, isLoading } = useSearch(query)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 px-4 pt-16 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              autoFocus
              placeholder="Buscar notícias..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">Nenhum resultado para &quot;{query}&quot;</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{results.length} resultado(s) para &quot;{query}&quot;</p>
            {results.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="flex gap-4 p-4 rounded-xl border hover:bg-gray-50 transition-colors">
                {post.coverImage && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 text-sm leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!query && (
          <div className="text-center py-16 text-gray-300">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">Digite para buscar notícias</p>
          </div>
        )}
      </div>
    </div>
  )
}

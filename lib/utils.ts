import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import slugify from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'pt',
  })
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function calculateCTR(clicks: number, impressions: number): string {
  if (impressions === 0) return '0.00%'
  return ((clicks / impressions) * 100).toFixed(2) + '%'
}

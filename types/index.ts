export type Role = 'ADMIN' | 'EDITOR'
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type AdType = 'BANNER' | 'NATIVE' | 'INTERSTITIAL' | 'BUSINESS' | 'SPONSOR'
export type AdPosition =
  | 'FEED_BETWEEN'
  | 'FEED_TOP'
  | 'GRID_BANNER'
  | 'GRID_BANNER_TOP'
  | 'GRID_BANNER_BOTTOM'
  | 'POST_DETAIL'
  | 'SIDEBAR'
  | 'BREAKING_BANNER'
  | 'SECTION_SPONSOR'
  | 'INLINE_BANNER'
  | 'ARTICLE_TOP'

export type BusinessCategory =
  | 'ALIMENTACAO'
  | 'SAUDE'
  | 'SERVICOS'
  | 'EDUCACAO'
  | 'COMERCIO'
  | 'ESPORTES'
  | 'AUTOMOTIVO'
  | 'IMOBILIARIO'
  | 'OUTRO'

export interface Business {
  id: string
  name: string
  logo?: string | null
  category: BusinessCategory
  description: string
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  website?: string | null
  isPremium: boolean
  active: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon?: string | null
  order: number
  active: boolean
  createdAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Post {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  coverImage?: string | null
  media?: { url: string; type: 'image' | 'video' }[] | null
  status: PostStatus
  featured: boolean
  views: number
  categoryId: string
  category: Category
  authorId: string
  author: Pick<User, 'id' | 'name' | 'avatar'>
  tags: Tag[]
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Ad {
  id: string
  title: string
  type: AdType
  imageUrl: string
  targetUrl: string
  client: string
  position: AdPosition
  frequency: number
  impressions: number
  clicks: number
  active: boolean
  startsAt: Date
  endsAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface SiteConfig {
  id: string
  siteName: string
  tagline: string
  logo?: string | null
  favicon?: string | null
  social?: {
    instagram?: string
    facebook?: string
    twitter?: string
    youtube?: string
  } | null
  analytics?: Record<string, string> | null
  updatedAt: Date
}

// Feed item: post or ad
export type FeedItem =
  | { type: 'post'; data: Post }
  | { type: 'ad'; data: Ad }

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ApiError {
  error: string
  message?: string
}

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  viewsToday: number
  activeAds: number
  topPosts: Pick<Post, 'id' | 'title' | 'views' | 'slug'>[]
  recentPosts: Pick<Post, 'id' | 'title' | 'status' | 'createdAt' | 'slug' | 'coverImage'>[]
}

import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export function buildMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}): Metadata {
  const fullTitle = title.includes('Foz.Foco') ? title : `${title} | Foz.Foco`
  const ogImage = image || `${siteUrl}/og-default.png`
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: 'Foz.Foco',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'pt_BR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: { canonical: pageUrl },
  }
}

export function buildArticleJsonLd({
  title,
  description,
  image,
  url,
  publishedAt,
  authorName,
  categoryName,
}: {
  title: string
  description: string
  image?: string
  url: string
  publishedAt: Date
  authorName: string
  categoryName: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: image ? [image] : [],
    url: `${siteUrl}${url}`,
    datePublished: publishedAt.toISOString(),
    dateModified: publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Foz.Foco',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    articleSection: categoryName,
    inLanguage: 'pt-BR',
  }
}

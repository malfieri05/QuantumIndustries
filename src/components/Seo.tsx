import { Helmet } from 'react-helmet-async'
import { site } from '../content/site'

const SITE_URL = site.publicUrl

interface SeoProps {
  title?: string
  description?: string
  path?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}

export function Seo({
  title,
  description,
  path = '/',
  ogType = 'website',
  noIndex = false,
}: SeoProps) {
  const pageTitle = title
    ? `${title} | ${site.name}`
    : `${site.name} — ${site.tagline}`
  const pageDescription =
    description ??
    'Custom-fit AI automation, build-to-own software, and competitive intelligence systems for growing businesses. Free consultation — no obligation.'
  const canonical = `${SITE_URL}${path}`
  const ogImage = `${SITE_URL}/og-image.png`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${site.name} — ${site.tagline}`} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${site.name} — ${site.tagline}`} />

      {/* Misc */}
      <meta name="theme-color" content="#1e427b" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  )
}

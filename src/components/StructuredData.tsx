import { Helmet } from 'react-helmet-async'
import { site } from '../content/site'

const SITE_URL = site.publicUrl

function jsonLd(data: Record<string, unknown>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: SITE_URL,
    logo: `${SITE_URL}/LOGO-NOBACKGROUND.png`,
    telephone: site.phone.tel,
    description:
      'Custom-fit AI automation, build-to-own software, and competitive intelligence systems for growing businesses.',
    sameAs: [] as string[],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phone.tel,
      contactType: 'sales',
      availableLanguage: 'English',
    },
  }
  return <Helmet>{jsonLd(data)}</Helmet>
}

export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url: SITE_URL,
    telephone: site.phone.tel,
    priceRange: '$$',
    image: `${SITE_URL}/LOGO-NOBACKGROUND.png`,
    description:
      'AI automation, custom software development, and competitive intelligence systems. Free consultation — no obligation.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Portland',
      addressRegion: 'OR',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceType: [
      'AI Automation',
      'Custom Software Development',
      'Competitive Intelligence',
      'Build-to-Own Software',
    ],
  }
  return <Helmet>{jsonLd(data)}</Helmet>
}

export function FAQSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
  return <Helmet>{jsonLd(data)}</Helmet>
}

export function ServiceSchema() {
  const services = [
    {
      name: 'AI Automation & Custom Software',
      description:
        'Identify where automation or bespoke software removes inefficiencies, reduces errors, and enhances your operations.',
    },
    {
      name: 'Build-to-Own Software',
      description:
        'Replace recurring subscriptions with original software designed around your requirements — a one-time build you own.',
    },
    {
      name: 'Competitive Intelligence Systems',
      description:
        'Custom systems that continuously monitor your competitors, analyze their moves, and surface meaningful insights.',
    },
  ]

  const data = services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: s.name,
    provider: {
      '@type': 'Organization',
      name: site.name,
      url: SITE_URL,
    },
    description: s.description,
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
  }))

  return (
    <Helmet>
      {data.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </Helmet>
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <Helmet>{jsonLd(data)}</Helmet>
}

export function WebSiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: SITE_URL,
    description:
      'Custom-fit AI automation, build-to-own software, and competitive intelligence systems for growing businesses.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return <Helmet>{jsonLd(data)}</Helmet>
}

import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProcessSection } from '../components/ProcessSection'
import { SectionDivider } from '../components/SectionDivider'
import { ServicesSection } from '../components/ServicesSection'
import { ContactSection } from '../components/ContactSection'
import { FaqSection } from '../components/FaqSection'
import { SupportSection } from '../components/SupportSection'
import { Seo } from '../components/Seo'
import {
  OrganizationSchema,
  LocalBusinessSchema,
  FAQSchema,
  ServiceSchema,
  WebSiteSchema,
} from '../components/StructuredData'
import { scrollToSectionById } from '../lib/hashNav'

export function HomePage() {
  const location = useLocation()

  useLayoutEffect(() => {
    const id = location.hash.replace(/^#/, '')
    if (!id) return
    const behavior: ScrollBehavior = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
      ? 'instant'
      : 'smooth'
    const frame = requestAnimationFrame(() => {
      scrollToSectionById(id, behavior)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  return (
    <>
      <Seo
        description="Custom-fit AI automation, build-to-own software, and competitive intelligence systems for growing businesses. Free consultation — no obligation."
        path="/"
      />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <FAQSchema />
      <ServiceSchema />

      <div className="qi-backdrop" aria-hidden />
      <div className="qi-grid" aria-hidden />
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <SectionDivider />
        <ProcessSection />
        <SectionDivider />
        <SupportSection />
        <SectionDivider />
        <ContactSection />
        <FaqSection />
        <SectionDivider />
      </main>
      <Footer />
    </>
  )
}

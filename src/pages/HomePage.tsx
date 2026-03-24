import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProcessSection } from '../components/ProcessSection'
import { SectionDivider } from '../components/SectionDivider'
import { ServicesSection } from '../components/ServicesSection'
import { ContactSection } from '../components/ContactSection'
import { SupportSection } from '../components/SupportSection'
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
    // One frame after layout so targets exist; smooth scroll matches header nav / in-page links.
    const frame = requestAnimationFrame(() => {
      scrollToSectionById(id, behavior)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  return (
    <>
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
        <SectionDivider />
      </main>
      <Footer />
    </>
  )
}

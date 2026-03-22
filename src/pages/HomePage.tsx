import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProcessSection } from '../components/ProcessSection'
import { ServicesSection } from '../components/ServicesSection'
import { SupportSection } from '../components/SupportSection'
import { scrollToSectionById } from '../lib/hashNav'

export function HomePage() {
  const location = useLocation()

  useLayoutEffect(() => {
    const id = location.hash.replace(/^#/, '')
    if (!id) return
    const frame = requestAnimationFrame(() => {
      scrollToSectionById(id)
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
        <ProcessSection />
        <SupportSection />
      </main>
      <Footer />
    </>
  )
}

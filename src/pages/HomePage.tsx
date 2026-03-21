import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProcessSection } from '../components/ProcessSection'
import { ServicesSection } from '../components/ServicesSection'

export function HomePage() {
  return (
    <>
      <div className="qi-backdrop" aria-hidden />
      <div className="qi-grid" aria-hidden />
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <ProcessSection />
      </main>
      <Footer />
    </>
  )
}

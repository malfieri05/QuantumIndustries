import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProcessSection } from '../components/ProcessSection'
import { ReplicaSection } from '../components/ReplicaSection'
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
        <ReplicaSection />
        <ProcessSection />
      </main>
      <Footer />
    </>
  )
}

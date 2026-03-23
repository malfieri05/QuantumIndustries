import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AnimatedRoutes } from './components/AnimatedRoutes'

function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 767px)').matches) return
    void import('./pages/BookingPage')
  }, [])

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App

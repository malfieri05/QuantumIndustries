import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BookingModal } from './components/BookingModal'
import { BookingProvider } from './context/BookingContext'
import { site } from './content/site'
import { BookingPage } from './pages/BookingPage'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={site.booking.path} element={<BookingPage />} />
        </Routes>
        <BookingModal />
      </BookingProvider>
    </BrowserRouter>
  )
}

export default App

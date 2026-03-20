import { Link } from 'react-router-dom'
import { CalendlyInline } from '../components/CalendlyInline'
import { site } from '../content/site'

export function BookingPage() {
  const { booking, name, tagline } = site

  return (
    <div className="min-h-svh bg-[#e8eef5] font-sans text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex flex-col leading-tight focus-visible:rounded-md">
            <span className="font-display text-base font-semibold tracking-tight text-[#0f172a] transition group-hover:text-cyan-700 sm:text-lg">
              {name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-[11px]">
              {tagline}
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-cyan-700 underline-offset-4 transition hover:text-cyan-800 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="text-center font-display text-3xl font-bold tracking-tight text-[#0f2847] sm:text-4xl">
          {booking.title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-base text-slate-600 sm:text-lg">
          {booking.subtitle}
        </p>

        <div className="mt-10 overflow-x-auto [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
          <CalendlyInline />
        </div>
      </div>
    </div>
  )
}

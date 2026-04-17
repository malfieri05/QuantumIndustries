import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { playBookingTapSound } from '../lib/bookingTapSound'
import { routeSlide } from '../lib/routeTransitions'
import { Reveal } from './Reveal'

const contactApiUrl =
  import.meta.env.VITE_CONTACT_API_URL?.trim() || '/api/contact'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSection() {
  const { contact } = site
  const hpRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setStatus('submitting')
    try {
      const res = await fetch(contactApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          message,
          honeypot: hpRef.current?.value ?? '',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
      }
      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setMessage('')
      if (hpRef.current) hpRef.current.value = ''
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-black/[0.16] bg-white/80 px-4 py-3 text-sm text-qi-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition placeholder:text-qi-muted/70 focus:border-qi-fg/40 focus:ring-2 focus:ring-[#1e427b]/30'

  return (
    <section
      className="relative pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <div id={contact.id} className="scroll-anchor" aria-hidden="true" />
        <Reveal>
          <h2
            id="contact-heading"
            className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {contact.title}
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-4 flex max-w-2xl flex-wrap items-baseline gap-x-2 gap-y-1 text-sm leading-relaxed text-qi-fg/85 sm:text-base">
            <span>{contact.blurb}</span>
            <span className="text-qi-fg/45 select-none" aria-hidden>
              |
            </span>
            <span>
              or{' '}
              <Link
                to={site.consultation.path}
                state={routeSlide.forward}
                className="font-medium text-[#1e427b] underline decoration-[#1e427b] underline-offset-[3px] transition-colors hover:text-[#163566] hover:decoration-[#163566]"
                onClick={() => {
                  playBookingTapSound()
                }}
              >
                submit discovery form
              </Link>
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="support-memo-panel mt-12 sm:mt-16 sm:mx-6 md:mx-14"
            role="region"
            aria-labelledby="contact-form-label"
          >
            <span id="contact-form-label" className="sr-only">
              Contact form
            </span>
            {status === 'success' ? (
              <div className="flex items-center gap-3 sm:gap-4" role="status">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600"
                  aria-hidden="true"
                >
                  <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.75" />
                    <path
                      d="M8 12.5l2.5 2.5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="min-w-0 flex-1 text-base leading-normal text-qi-fg sm:text-lg sm:leading-normal">
                  Thank you. We received your message and sent a confirmation to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
                <input
                  ref={hpRef}
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute h-px w-px -translate-x-[9999px] opacity-0"
                  aria-hidden="true"
                />
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label htmlFor="contact-first" className="text-xs font-medium uppercase tracking-wider text-qi-muted">
                      First name
                    </label>
                    <input
                      id="contact-first"
                      required
                      autoComplete="given-name"
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-last" className="text-xs font-medium uppercase tracking-wider text-qi-muted">
                      Last name
                    </label>
                    <input
                      id="contact-last"
                      required
                      autoComplete="family-name"
                      className={inputClass}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label htmlFor="contact-email" className="text-xs font-medium uppercase tracking-wider text-qi-muted">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-xs font-medium uppercase tracking-wider text-qi-muted">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-xs font-medium uppercase tracking-wider text-qi-muted">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    className={`${inputClass} min-h-[8rem] resize-y`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                {status === 'error' && errorMessage ? (
                  <p className="text-sm text-red-700" role="alert">
                    {errorMessage}
                  </p>
                ) : null}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="header-pill inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-medium tracking-wide text-qi-fg transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

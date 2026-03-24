import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { sendChatMessage } from '../lib/chatApi'
import type { ChatApiMessage } from '../types/chat'

/** Panel + launcher sized ~10% above the original layout. */
const PANEL_MAX_H = 'min(77dvh,30.8rem)'

export function ChatWidget() {
  const reduced = useReducedMotion()
  const panelId = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatApiMessage[]>([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const send = async () => {
    const text = draft.trim()
    if (!text || pending) return
    setError(null)
    const next: ChatApiMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setDraft('')
    setPending(true)
    const res = await sendChatMessage(next)
    setPending(false)
    if ('error' in res) {
      setError(res.error)
      return
    }
    setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
  }

  const transition = reduced ? { duration: 0 } : { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const }

  return (
    <>
      <div
        className="pointer-events-none fixed bottom-6 right-5 z-[100] flex max-w-[calc(100vw-2.5rem)] flex-col-reverse gap-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="pointer-events-auto flex justify-end">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-label={open ? 'Close chat' : 'Open chat'}
            onClick={() => (open ? close() : setOpen(true))}
            className="box-border flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-2xl border border-qi-border-strong bg-qi-elevated/95 p-2 shadow-qi-float-subtle transition hover:border-qi-accent/35 hover:shadow-qi-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qi-accent/80"
          >
            {open ? (
              <span
                className="flex h-[73px] w-[73px] items-center justify-center text-[3.9325rem] font-light leading-none tracking-tight text-qi-accent"
                aria-hidden
              >
                ×
              </span>
            ) : (
              <img
                src="/coreNOBACKGROUND.png"
                alt=""
                width={73}
                height={73}
                className="h-[73px] w-[73px] object-contain"
                decoding="async"
              />
            )}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              key="chat-panel"
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={`${site.name} assistant`}
              initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={transition}
              className="pointer-events-auto flex max-h-[var(--panel-max)] w-[min(100vw-2.5rem,24.2rem)] flex-col overflow-hidden rounded-qi-card border border-qi-border-strong bg-qi-elevated/95"
              style={
                {
                  '--panel-max': PANEL_MAX_H,
                } as CSSProperties
              }
            >
              <div
                className={`border-b border-qi-border bg-[var(--color-qi-header-bg)] px-[1.125rem] ${messages.length > 0 ? 'py-[0.6875rem]' : 'py-[0.825rem]'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 font-display text-[0.9625rem] font-semibold leading-tight text-qi-fg">
                    {site.name}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close chat"
                    className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-qi-fg/65 transition hover:bg-black/[0.05] hover:text-qi-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qi-accent/70"
                  >
                    <svg
                      className="h-[18px] w-[18px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
                {messages.length === 0 ? (
                  <p className="mt-0.5 text-[0.825rem] leading-relaxed text-qi-muted">
                    Ask anything about our services or this site. Verify important details by booking a
                    consultation or calling us.
                  </p>
                ) : null}
              </div>

              <div
                className="min-h-0 flex-1 space-y-[0.825rem] overflow-y-auto px-[1.125rem] py-[0.825rem]"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {messages.length === 0 ? (
                  <p className="text-[0.9625rem] leading-relaxed text-qi-muted">
                    Try: “What do you offer?” or “How does the process work?”
                  </p>
                ) : null}
                {messages.map((m, i) => (
                  <div
                    key={`${i}-${m.role}-${m.content.slice(0, 12)}`}
                    className={`max-w-[95%] rounded-lg px-[0.825rem] py-2 text-[0.9625rem] leading-relaxed ${
                      m.role === 'user'
                        ? 'ml-auto bg-qi-accent-muted text-qi-fg'
                        : 'mr-auto bg-qi-surface text-qi-fg'
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {pending ? (
                  <p className="text-[0.825rem] text-qi-muted" aria-live="polite">
                    Thinking…
                  </p>
                ) : null}
                {error ? (
                  <p className="text-[0.9625rem] text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-qi-border px-[0.825rem] py-[0.55rem] text-[12.1px] leading-normal text-qi-muted">
                <div className="flex flex-wrap items-center gap-x-0">
                  <a
                    href={`tel:${site.phone.tel}`}
                    className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-qi-fg"
                  >
                    <svg
                      className="h-[13.86px] w-[13.86px] shrink-0 opacity-90"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        fill="currentColor"
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                      />
                    </svg>
                    {site.phone.display}
                  </a>
                  <span
                    className="mx-2 inline-flex shrink-0 select-none text-[15px] font-medium leading-none text-qi-muted/55"
                    aria-hidden
                  >
                    ·
                  </span>
                  <Link
                    to={site.booking.path}
                    className="underline underline-offset-2 hover:text-qi-fg"
                  >
                    Book consultation
                  </Link>
                </div>
              </div>

              <div className="border-t border-qi-border p-[0.825rem]">
                <label htmlFor="qi-chat-input" className="sr-only">
                  Message
                </label>
                <textarea
                  id="qi-chat-input"
                  ref={inputRef}
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void send()
                    }
                  }}
                  placeholder="Type a message…"
                  disabled={pending}
                  className="w-full resize-none rounded-xl border border-qi-border-strong bg-qi-bg px-[0.825rem] py-2 text-[0.9625rem] text-qi-fg placeholder:text-qi-muted/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qi-accent/70"
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={pending || !draft.trim()}
                  className="mt-[0.55rem] w-full rounded-xl bg-qi-accent py-[0.6875rem] text-[0.9625rem] font-semibold text-white transition hover:bg-qi-accent-bright disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  )
}

import { useId, useMemo, useState } from 'react'
import { site } from '../content/site'
import { Reveal } from './Reveal'

export function FaqSection() {
  const { faq } = site
  const sectionUid = useId()

  const [openByKey, setOpenByKey] = useState<Record<string, boolean>>({})

  const rowKeys = useMemo(
    () => faq.items.map((item, i) => `${i}-${item.q.slice(0, 24)}`),
    [faq.items],
  )

  return (
    <section
      className="relative pt-20 pb-28 sm:pt-24 sm:pb-32 lg:pt-28 lg:pb-40"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div id={faq.id} className="scroll-anchor" aria-hidden="true" />
        <Reveal>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {faq.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-col gap-3 sm:mt-14 sm:gap-4 lg:mx-auto lg:max-w-3xl">
            {faq.items.map((item, index) => {
              const rowKey = rowKeys[index]!
              const isOpen = Boolean(openByKey[rowKey])
              const btnId = `${sectionUid}-faq-btn-${rowKey}`
              const panelId = `${sectionUid}-faq-panel-${rowKey}`

              return (
                <div
                  key={rowKey}
                  className="faq-item faq-row"
                  data-state={isOpen ? 'open' : 'closed'}
                >
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      setOpenByKey((prev) => ({ ...prev, [rowKey]: !prev[rowKey] }))
                    }}
                    className="faq-summary flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-4 text-left outline-none transition-[background-color,color] duration-300 ease-out sm:px-5 sm:py-5 focus-visible:ring-2 focus-visible:ring-[#1e427b]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--color-qi-elevated)_90%,transparent)]"
                  >
                    <span className="min-w-0 font-display text-base font-semibold leading-snug tracking-tight text-qi-fg sm:text-[1.0725rem]">
                      {item.q}
                    </span>
                    <span
                      className="faq-toggle relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-qi-accent/22 bg-[color-mix(in_oklab,var(--color-qi-accent)_10%,transparent)] text-qi-accent transition-[border-color,background-color] duration-300 ease-out sm:size-10"
                      aria-hidden
                    >
                      <span className="faq-icon">
                        <span className="faq-bar faq-bar-h" />
                        <span className="faq-bar faq-bar-v" />
                      </span>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    aria-hidden={!isOpen}
                    className="faq-answer-grid"
                  >
                    <div className="faq-answer-grid-inner">
                      <div className="faq-answer-body px-4 pb-5 pt-1 sm:px-5 sm:pb-6 sm:pt-2">
                        <p className="max-w-prose text-pretty text-sm leading-[1.78] text-qi-fg/90 sm:text-[0.9625rem] sm:leading-[1.82]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

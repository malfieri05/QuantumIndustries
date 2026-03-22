import Cal from '@calcom/embed-react'
import { useEffect } from 'react'
import { getCalLinkPath } from '../lib/cal'

type CalcomEmbedProps = {
  className?: string
}

/**
 * Official inline embed + `ui` instruction so we can drop the extra booker chrome
 * (bordered “frame” around the 3-column picker) via cssVarsPerTheme.
 */
const calUiConfig = {
  theme: 'light' as const,
  cssVarsPerTheme: {
    light: {
      'cal-border-booker': 'transparent',
      'cal-border-booker-width': '0px',
    },
    dark: {
      'cal-border-booker': 'transparent',
      'cal-border-booker-width': '0px',
    },
  },
  styles: {
    body: { background: 'transparent' as const },
  },
}

export function CalcomEmbed({ className = '' }: CalcomEmbedProps) {
  useEffect(() => {
    const w = window as Window & {
      Cal?: (cmd: string, arg: typeof calUiConfig) => void
    }
    const id = window.setTimeout(() => {
      w.Cal?.('ui', calUiConfig)
    }, 200)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      className={`calcom-booking-embed min-h-[700px] w-full min-w-full lg:min-w-[1100px] ${className}`.trim()}
    >
      <Cal
        calLink={getCalLinkPath()}
        calOrigin="https://cal.com"
        className="calcom-booking-root min-h-[700px] w-full"
      />
    </div>
  )
}

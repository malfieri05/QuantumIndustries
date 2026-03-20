/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CALENDLY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  Calendly?: {
    initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void
  }
}

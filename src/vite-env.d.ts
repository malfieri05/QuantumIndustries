/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional override for Cal.com event URL (default: quantumindustries/30min). */
  readonly VITE_CAL_BOOKING_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

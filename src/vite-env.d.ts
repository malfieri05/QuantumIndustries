/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional override for Cal.com event URL (default: quantumindustries/30min). */
  readonly VITE_CAL_BOOKING_URL: string
  /** Optional absolute URL for POST /api/chat (defaults to same-origin `/api/chat`). */
  readonly VITE_CHAT_API_URL: string
  /** Optional absolute URL for POST /api/contact (defaults to same-origin `/api/contact`). */
  readonly VITE_CONTACT_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

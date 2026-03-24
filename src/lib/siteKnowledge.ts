import { site } from '../content/site.js'

/**
 * Canonical JSON snapshot of public marketing copy for the chat API system prompt.
 * Keep in sync with site.ts only (single source of truth).
 */
export function getSiteKnowledgeJson(): string {
  return JSON.stringify(site, null, 2)
}

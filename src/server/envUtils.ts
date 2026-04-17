/**
 * Read a secret from `process.env`: trim whitespace and strip a single pair of
 * wrapping quotes (common when pasting from docs or password managers).
 */
export function readEnvSecret(name: string): string | undefined {
  const raw = process.env[name]
  if (typeof raw !== 'string') return undefined
  let s = raw.trim()
  if (!s) return undefined
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim()
  }
  return s || undefined
}

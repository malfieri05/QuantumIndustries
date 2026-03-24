import { chatFaqEntries, chatKnowledgeSnippets } from '../content/chatKnowledge'
import { site } from '../content/site'
import { getSiteKnowledgeJson } from './siteKnowledge'

const STOP = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'shall',
  'can',
  'need',
  'dare',
  'ought',
  'used',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'as',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  'just',
  'and',
  'but',
  'if',
  'or',
  'because',
  'until',
  'while',
  'although',
  'though',
  'whether',
  'either',
  'neither',
  'both',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'me',
  'him',
  'her',
  'us',
  'them',
  'my',
  'your',
  'his',
  'its',
  'our',
  'their',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'about',
])

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(query: string): string[] {
  return normalize(query)
    .split(' ')
    .filter((w) => w.length > 1 && !STOP.has(w))
}

function scoreFaq(queryNorm: string, tokenSet: Set<string>, entry: (typeof chatFaqEntries)[number]): number {
  let score = 0
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase()
    if (queryNorm.includes(k)) score += 4
    for (const t of tokenSet) {
      if (k.includes(t) || t.includes(k)) score += 1
    }
  }
  for (const q of entry.questions ?? []) {
    const qn = q.toLowerCase()
    if (queryNorm.includes(qn) || qn.includes(queryNorm)) score += 6
    else {
      const slice = qn.slice(0, Math.min(24, qn.length))
      if (slice.length >= 4 && queryNorm.includes(slice)) score += 3
    }
  }
  return score
}

function scoreSnippet(queryNorm: string, tokenSet: Set<string>, text: string, keywords?: string[]): number {
  const tn = text.toLowerCase()
  let score = 0
  for (const t of tokenSet) {
    if (tn.includes(t)) score += 1
  }
  if (keywords) {
    for (const kw of keywords) {
      if (queryNorm.includes(kw.toLowerCase())) score += 3
    }
  }
  return score
}

function fallbackAnswer(): string {
  return `I couldn’t find a close match in the information loaded for this assistant. For specifics about your situation, call ${site.phone.display} or book a free consultation—there’s no obligation.`
}

/**
 * Returns a single reply string using FAQ entries, optional snippets, then site JSON text overlap.
 */
export function matchChatQuery(userMessage: string): string {
  const trimmed = userMessage.trim()
  if (!trimmed) {
    return 'Ask a question about Quantum Industries or this website.'
  }

  const queryNorm = normalize(trimmed)
  const tokens = tokenize(trimmed)
  const tokenSet = new Set(tokens)

  let best: { score: number; text: string } = { score: 0, text: '' }

  for (const entry of chatFaqEntries) {
    const s = scoreFaq(queryNorm, tokenSet, entry)
    if (s > best.score) {
      best = { score: s, text: entry.answer }
    }
  }

  if (best.score >= 5) {
    return best.text
  }

  for (const sn of chatKnowledgeSnippets) {
    const s = scoreSnippet(queryNorm, tokenSet, sn.text, sn.keywords)
    if (s > best.score) {
      best = { score: s, text: sn.text }
    }
  }

  if (best.score >= 4) {
    return best.text
  }

  const blob = getSiteKnowledgeJson().toLowerCase()
  let siteScore = 0
  let excerpt = ''
  for (const t of tokenSet) {
    if (t.length < 3) continue
    const idx = blob.indexOf(t)
    if (idx !== -1) {
      siteScore += 1
      if (!excerpt) {
        const start = Math.max(0, idx - 80)
        const end = Math.min(blob.length, idx + 280)
        excerpt = blob.slice(start, end).replace(/\s+/g, ' ').trim()
      }
    }
  }

  if (siteScore >= 3 && excerpt) {
    return `Here’s what I found in the site content: “${excerpt}” For a precise answer about your case, call ${site.phone.display} or book a consultation.`
  }

  if (best.score >= 2 && best.text) {
    return best.text
  }

  return fallbackAnswer()
}

import OpenAI from 'openai'
import { chatFaqEntries, chatKnowledgeSnippets } from '../content/chatKnowledge'
import { site } from '../content/site'
import { getSiteKnowledgeJson } from '../lib/siteKnowledge'
import type { ChatApiMessage, ChatRequestBody } from '../types/chat'

const MODEL = 'gpt-4o-mini'
const MAX_MESSAGES = 14
const MAX_USER_CHARS = 4000
const RATE_WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20

const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const b = rateBuckets.get(ip)
  if (!b || now > b.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (b.count >= MAX_REQUESTS_PER_WINDOW) return false
  b.count += 1
  return true
}

function buildSystemPrompt(): string {
  const siteJson = getSiteKnowledgeJson()
  const faqJson = JSON.stringify(
    chatFaqEntries.map((e) => ({
      id: e.id,
      keywords: e.keywords,
      questions: e.questions,
      answer: e.answer,
    })),
    null,
    2,
  )
  const snippetsJson = JSON.stringify(chatKnowledgeSnippets, null, 2)

  return `You are a helpful assistant for "${site.name}" (${site.tagline}) on their marketing website.

Answer using ONLY the information in the JSON blocks below (site copy, FAQ entries, snippets). Do not invent services, pricing, guarantees, policies, or legal/medical/financial advice. If something is not covered, say you do not have that detail and suggest booking a free consultation or calling ${site.phone.display}.

Be concise (about 2–6 sentences unless the user asks for a list). Professional and friendly tone.

When relevant, mention booking a consultation (path: ${site.booking.path}) or phone ${site.phone.display}.

--- Site content (JSON) ---
${siteJson}

--- Curated FAQ (JSON) ---
${faqJson}

--- Extra snippets (JSON) ---
${snippetsJson}`
}

function validateBody(body: unknown): ChatRequestBody | null {
  if (!body || typeof body !== 'object') return null
  const messages = (body as { messages?: unknown }).messages
  if (!Array.isArray(messages)) return null
  if (messages.length > MAX_MESSAGES) return null
  const out: ChatApiMessage[] = []
  for (const m of messages) {
    if (!m || typeof m !== 'object') return null
    const role = (m as { role?: unknown }).role
    const content = (m as { content?: unknown }).content
    if (role !== 'user' && role !== 'assistant') return null
    if (typeof content !== 'string' || content.length === 0) return null
    out.push({ role, content })
  }
  if (out.length === 0) return null
  let userChars = 0
  for (const m of out) {
    if (m.role === 'user') userChars += m.content.length
  }
  if (userChars > MAX_USER_CHARS) return null
  return { messages: out }
}

export async function handleChatRequest(
  body: unknown,
  clientIp: string,
): Promise<
  | { ok: true; reply: string }
  | { ok: false; status: number; error: string }
> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      ok: false,
      status: 503,
      error: 'Chat is not configured (missing OPENAI_API_KEY).',
    }
  }

  if (!rateLimitOk(clientIp)) {
    return {
      ok: false,
      status: 429,
      error: 'Too many messages. Please wait a minute and try again.',
    }
  }

  const parsed = validateBody(body)
  if (!parsed) {
    return { ok: false, status: 400, error: 'Invalid request body.' }
  }

  const openai = new OpenAI({ apiKey: key })

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.35,
      max_tokens: 600,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...parsed.messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    })

    const reply = completion.choices[0]?.message?.content?.trim()
    if (!reply) {
      return { ok: false, status: 502, error: 'No response from assistant.' }
    }
    return { ok: true, reply }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Request failed.'
    return { ok: false, status: 502, error: msg }
  }
}

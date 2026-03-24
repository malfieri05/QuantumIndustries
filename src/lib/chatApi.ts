import type { ChatApiMessage } from '../types/chat'

const DEFAULT_PATH = '/api/chat'

function chatUrl(): string {
  const base = import.meta.env.VITE_CHAT_API_URL
  if (typeof base === 'string' && base.length > 0) return base
  return DEFAULT_PATH
}

export type ChatApiResponse = { reply: string } | { error: string }

export async function sendChatMessage(
  messages: ChatApiMessage[],
): Promise<ChatApiResponse> {
  const res = await fetch(chatUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  const data = (await res.json()) as unknown
  if (!res.ok) {
    const err =
      data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'Something went wrong.'
    return { error: err }
  }
  if (
    data &&
    typeof data === 'object' &&
    'reply' in data &&
    typeof (data as { reply: unknown }).reply === 'string'
  ) {
    return { reply: (data as { reply: string }).reply }
  }
  return { error: 'Invalid response.' }
}

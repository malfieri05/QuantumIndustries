export type ChatApiMessage = { role: 'user' | 'assistant'; content: string }

export type ChatRequestBody = {
  messages: ChatApiMessage[]
}

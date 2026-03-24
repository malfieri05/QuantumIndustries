import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleContactRequest } from '../src/server/contactCore.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const forwarded = req.headers['x-forwarded-for']
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : undefined) ||
    req.socket?.remoteAddress ||
    'unknown'

  const payload =
    typeof req.body === 'string' ? (JSON.parse(req.body) as unknown) : req.body
  const result = await handleContactRequest(payload, ip)
  if (result.ok) {
    res.status(200).json({ ok: true })
  } else {
    res.status(result.status).json({ error: result.error })
  }
}

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { handleChatRequest } from './src/server/chatCore'
import { handleContactRequest } from './src/server/contactCore'
import { handleConsultationRequest } from './src/server/consultationCore'
import { handleConsultationAudioRequest } from './src/server/consultationAudioCore'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function qiApiDevPlugin(): Plugin {
  return {
    name: 'qi-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = req.url?.split('?')[0]
        if (
          req.method !== 'POST' ||
          (pathOnly !== '/api/chat' &&
            pathOnly !== '/api/contact' &&
            pathOnly !== '/api/consultation' &&
            pathOnly !== '/api/consultation-audio')
        ) {
          next()
          return
        }
        const ip = req.socket.remoteAddress ?? 'local'
        try {
          const raw = await readBody(req)
          const body = JSON.parse(raw) as unknown
          res.setHeader('Content-Type', 'application/json')
          if (pathOnly === '/api/chat') {
            const result = await handleChatRequest(body, ip)
            if (result.ok) {
              res.statusCode = 200
              res.end(JSON.stringify({ reply: result.reply }))
            } else {
              res.statusCode = result.status
              res.end(JSON.stringify({ error: result.error }))
            }
            return
          }
          if (pathOnly === '/api/consultation-audio') {
            const result = await handleConsultationAudioRequest(body, ip)
            res.statusCode = result.ok ? 200 : result.status
            res.end(JSON.stringify(result.ok ? { ok: true } : { error: result.error }))
            return
          }
          if (pathOnly === '/api/consultation') {
            const result = await handleConsultationRequest(body, ip)
            if (result.ok) {
              res.statusCode = 200
              res.end(JSON.stringify({ ok: true }))
            } else {
              res.statusCode = result.status
              res.end(JSON.stringify({ error: result.error }))
            }
            return
          }
          const contactResult = await handleContactRequest(body, ip)
          if (contactResult.ok) {
            res.statusCode = 200
            res.end(JSON.stringify({ ok: true }))
          } else {
            res.statusCode = contactResult.status
            res.end(JSON.stringify({ error: contactResult.error }))
          }
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Server error.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(loaded)) {
    const trimmed = typeof value === 'string' ? value.trim() : value
    // Non-empty .env / .env.* values win over empty inherited shell vars (fixes OPENAI_API_KEY=).
    if (trimmed) process.env[key] = trimmed
  }

  return {
    plugins: [tailwindcss(), react(), qiApiDevPlugin()],
    server: {
      port: 5174,
      strictPort: false,
    },
  }
})

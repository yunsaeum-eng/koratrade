import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { buildNpcSystemPrompt, getNpcFallback } from '@/data/npcPrompts'

interface NpcRequest {
  npcId: string
  userMessage: string
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  episodeNum: number
  lang: string
  playerName: string
  relationship: number
}

export async function POST(req: NextRequest) {
  const body: NpcRequest = await req.json()

  // Check key at request time so hot-reloads pick up .env changes
  const noKey = !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-...')

  if (noKey) {
    return Response.json({ content: getNpcFallback(body.npcId, body.lang), source: 'no_key' })
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const systemPrompt = buildNpcSystemPrompt({
      npcId: body.npcId,
      lang: body.lang,
      episodeNum: body.episodeNum,
      relationship: body.relationship,
      playerName: body.playerName,
    })

    const history = body.conversationHistory.slice(-14)
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> =
      history.length > 0 && history[0].role === 'assistant'
        ? [{ role: 'user', content: '(conversation start)' }, ...history]
        : [...history]
    messages.push({ role: 'user', content: body.userMessage })

    // Single attempt — no retries. Fast fail keeps the UX responsive.
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: systemPrompt,
      messages,
    })

    const content = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : getNpcFallback(body.npcId, body.lang)

    return Response.json({ content, source: 'claude' })
  } catch (err: unknown) {
    const status = (err as { status?: number }).status
    const message = (err as { message?: string }).message ?? 'unknown'
    console.error(`NPC API (${status}): ${message}`)
    return Response.json({
      content: getNpcFallback(body.npcId, body.lang),
      source: 'fallback',
      error: `${status}: ${message}`,
    })
  }
}

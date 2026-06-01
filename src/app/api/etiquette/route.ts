import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

interface EtiquetteRequest {
  userMessage: string
  npcName: string
  relationshipType: string  // e.g. "senior colleague", "team manager", "peer"
  situation: string
  language: string
}

interface EtiquetteResult {
  hasIssue: boolean
  severity?: 'mild' | 'serious'
  tip?: string
}

const NO_KEY = () => !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-...')

export async function POST(req: NextRequest) {
  if (NO_KEY()) return Response.json({ hasIssue: false })

  const body: EtiquetteRequest = await req.json()

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const prompt = `The user sent this message: "${body.userMessage}"

This was sent to ${body.npcName} who is their ${body.relationshipType} in a Korean workplace.
Current situation: ${body.situation}
Language setting: ${body.language}

Check for these etiquette issues:
- Using informal speech (반말) with seniors when they should use formal speech (존댓말)
- Being too blunt or abrupt with a superior
- Ignoring a question they were asked
- One-word replies to detailed questions from a superior
- Unprofessional email language
- Being passive-aggressive

If there is a clear issue, respond with ONLY this JSON (no other text):
{"hasIssue": true, "severity": "mild" or "serious", "tip": "one sentence tip in Korean"}

If no issue (most messages are fine), respond with ONLY:
{"hasIssue": false}

Be lenient — only flag genuine etiquette problems, not personal style choices.`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '{"hasIssue": false}'
    const result: EtiquetteResult = JSON.parse(text)
    return Response.json(result)
  } catch {
    return Response.json({ hasIssue: false })
  }
}

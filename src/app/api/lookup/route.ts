import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { word, context, type } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.startsWith('sk-ant-...')) {
    return Response.json(
      type === 'word'
        ? { korean: '(API 키 필요)', example: '' }
        : { korean: '(API 키 필요)', usage: '', similar: [] }
    )
  }

  const prompt = type === 'word'
    ? `The user double-clicked the word "${word}" in this business English context: "${context}". Provide: 1) Korean translation in 5 words or less, 2) one natural example sentence using this word in a business context. Respond in JSON only, no extra text: {"korean": "...", "example": "..."}`
    : `Explain this business English phrase "${word}" from this context: "${context}". Provide Korean meaning, when to use it, and 2 similar expressions. Respond in JSON only, no extra text: {"korean": "...", "usage": "...", "similar": ["...", "..."]}`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const match = text.match(/\{[\s\S]*\}/)
    const json = match ? JSON.parse(match[0]) : {}
    return Response.json(json)
  } catch {
    return Response.json(
      type === 'word'
        ? { korean: '번역 실패', example: '' }
        : { korean: '번역 실패', usage: '', similar: [] }
    )
  }
}

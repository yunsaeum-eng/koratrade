import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.startsWith('sk-ant-...')) {
    return Response.json({ hasError: false })
  }

  const prompt = `Is there a clear grammatical error in this sentence: "${message}"?
Flag ONLY definite grammatical mistakes such as: wrong verb tense ("I have went"), subject-verb disagreement ("she don't"), wrong adjective/adverb form ("I am very boring" when meaning bored), missing articles where clearly wrong, or wrong word form.
Do NOT flag: missing capitalization, lowercase "i", proper nouns in lowercase, sentences not starting with a capital — these are normal in casual chat messages.
If yes: {"hasError": true, "original": "...", "corrected": "...", "explanation": "..."}  (explanation in Korean, one sentence)
If no clear error: {"hasError": false}
Respond in JSON only, no extra text.`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const match = text.match(/\{[\s\S]*\}/)
    const json = match ? JSON.parse(match[0]) : { hasError: false }
    return Response.json(json)
  } catch {
    return Response.json({ hasError: false })
  }
}

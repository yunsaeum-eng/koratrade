import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const GRADING_SYSTEM = `You are an expert business English writing evaluator for KoraTrade, a Korean K-athleisure brand.
You grade workplace report emails written by Korean learners of business English.

Grade on a scale of 0-100 using this rubric:

RUBRIC (total 100 points):
1. Subject Line (10 pts): Clear, specific, professional. "Re: Brand Profile Review" = 10, vague = 5, missing = 0.
2. Greeting (10 pts): Appropriate to recipient (e.g. "Dear Sarah," or "Hi Sarah,"). Missing = 0.
3. Professional Opening (15 pts): States purpose clearly in first 1-2 sentences. e.g. "I have reviewed the brand profile as requested."
4. Content Accuracy (25 pts): Mentions specific details from the KoraTrade brand profile (products like Signature Leggings, AeroRun Top, markets like Japan/Europe, pricing, MOQ). More specific = higher score.
5. Body Structure (15 pts): Logical flow, clear paragraphs, key information highlighted.
6. Professional Closing (15 pts): Summary, next step offer, or question. e.g. "Please let me know if you need further clarification."
7. Tone & Language (10 pts): Formal but natural business English. No slang. No grammar errors that obscure meaning.

IMPORTANT: Be encouraging but accurate. A score of 80+ means the email is ready to send. Below 80 needs revision.

Return ONLY valid JSON in this exact format:
{
  "score": 85,
  "pass": true,
  "breakdown": {
    "subjectLine": { "score": 8, "max": 10, "comment": "Clear and professional" },
    "greeting": { "score": 10, "max": 10, "comment": "Appropriate greeting" },
    "opening": { "score": 12, "max": 15, "comment": "States purpose but could be more direct" },
    "content": { "score": 20, "max": 25, "comment": "Mentions leggings and Japan market" },
    "structure": { "score": 12, "max": 15, "comment": "Good structure, minor flow issue" },
    "closing": { "score": 13, "max": 15, "comment": "Offers follow-up" },
    "tone": { "score": 10, "max": 10, "comment": "Professional and clear" }
  },
  "topStrength": "Your subject line and greeting are excellent",
  "mainFeedback": "Add more specific product details (e.g. pricing, MOQ) from the brand profile",
  "revisedOpening": "I have completed my review of the KoraTrade brand profile document."
}`

interface GradeRequest {
  subject: string
  greeting: string
  body: string
  closing: string
  lang: string
}

function buildEmailText(req: GradeRequest): string {
  return [
    `Subject: ${req.subject}`,
    '',
    req.greeting,
    '',
    req.body,
    '',
    req.closing,
  ].join('\n')
}

function fallbackGrade(emailText: string): object {
  const lower = emailText.toLowerCase()
  let score = 50

  if (lower.includes('subject:') && lower.length > 10) score += 5
  if (lower.includes('dear') || lower.includes('hi ')) score += 8
  if (lower.includes('reviewed') || lower.includes('completed') || lower.includes('읽었')) score += 10
  if (lower.includes('legging') || lower.includes('aeroru') || lower.includes('brand profile')) score += 12
  if (lower.includes('japan') || lower.includes('europe') || lower.includes('market')) score += 8
  if (lower.includes('please') || lower.includes('let me know') || lower.includes('question')) score += 7

  score = Math.min(score, 95)

  return {
    score,
    pass: score >= 80,
    breakdown: {
      subjectLine: { score: 7, max: 10, comment: 'Subject provided' },
      greeting: { score: 8, max: 10, comment: 'Greeting present' },
      opening: { score: 10, max: 15, comment: 'Opening could be more direct' },
      content: { score: score > 70 ? 18 : 12, max: 25, comment: 'Include specific product details' },
      structure: { score: 10, max: 15, comment: 'Add clear paragraph breaks' },
      closing: { score: 10, max: 15, comment: 'Professional closing present' },
      tone: { score: 7, max: 10, comment: 'Generally professional tone' },
    },
    topStrength: 'Professional structure and greeting',
    mainFeedback: score >= 80
      ? 'Well done! Your email is ready to send.'
      : 'Add specific details from the brand profile — product names, prices, and markets.',
    revisedOpening: 'I have reviewed the KoraTrade brand profile and would like to share my initial observations.',
  }
}

export async function POST(req: NextRequest) {
  const body: GradeRequest = await req.json()
  const emailText = buildEmailText(body)
  const lang = body.lang || 'ko'

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.startsWith('sk-ant-...')) {
    return Response.json({ ...fallbackGrade(emailText), source: 'fallback' })
  }

  const userPrompt = lang === 'ko'
    ? `다음 보고 이메일을 채점해 주세요. 이 이메일은 신입사원이 Sarah 팀장에게 KoraTrade 브랜드 소개서 검토 후 작성한 것입니다.\n\n${emailText}`
    : `Please grade this report email. It was written by a new employee to their manager Sarah after reviewing the KoraTrade brand profile.\n\n${emailText}`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: GRADING_SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)
    return Response.json({ ...result, source: 'ai' })
  } catch (err) {
    console.error('Grade email error:', err)
    return Response.json({ ...fallbackGrade(emailText), source: 'fallback' })
  }
}

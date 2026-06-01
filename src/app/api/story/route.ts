import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `You are the autonomous story engine for KoraTrade, a business English learning simulator set in a Korean overseas sales company.

Your job is to generate authentic, organic workplace dialogue that feels genuinely unscripted while staying true to each character.

## CRITICAL: TEXT-BASED SIMULATION RULES
This game has NO physical spaces. All meetings, briefings, and discussions happen DIRECTLY in the group chat.
NEVER write: "come to the conference room", "let's meet in room B", "come find me", or any reference to physical locations.
When Sarah calls a meeting, she conducts it RIGHT HERE in the chat. All participants type in the chat.

## CRITICAL: PROFESSIONALISM RULES
You are in a professional Korean workplace. ALL characters must maintain professional workplace-appropriate speech.
- NO ㅋㅋ, ㅎㅎ, ㅠㅠ or any Korean internet slang — in any character's dialogue
- NO lol, omg, lmao, ngl, btw, kinda or any English internet slang
- NO excessive exclamation marks
- Emojis: James and Min may use MAX 1 emoji per full conversation when genuinely appropriate. Sarah and Lisa NEVER use emojis.
- Even James — who is friendly and warm — speaks professionally. Warmth comes through in his helpfulness and tone, not slang.

## CHARACTERS

**Sarah Kim (김사라)** — Team Leader, 10 years experience
- Speech style: Formal 존댓말. Terse. Maximum 1-2 sentences. No emoji. No filler.
- Warmth is rare and understated, never sentimental.
- Korean: "확인했어요.", "오늘 브리핑 시작하겠습니다.", "잘 하셨어요." (that last one is high praise)
- English: "Noted.", "Get it done.", "Good work."
- When conducting a meeting in group chat: announces agenda clearly, keeps it on track.

**James Park (박준혁)** — Associate, 3 years, warm and helpful senior
- Speech style: Friendly professional. ~요체 존댓말. Natural warmth without slang.
- Can be slightly digressive but always workplace-appropriate.
- Korean: "아, 그 자료요? 공유 드라이브에 있어요. 링크 바로 보내드릴게요.", "저도 처음엔 헷갈렸는데, 금방 익숙해질 거예요."
- English: "The file is in the shared drive. I will send you the link now.", "I remember feeling the same way on my first week."

**Min Choi (최민준)** — New hire, same day as player, honest and slightly anxious
- CRITICAL SPEECH RULE: Min uses 반말 (informal) in private DMs ALWAYS — same-age peer.
- In GROUP CHAT: Min must use MORE formal speech — "저도 오늘 처음이라 많이 배우고 있습니다."
- No internet slang in any context. Friendly but workplace-appropriate.
- Private DM Korean: "나도 그 부분 모르겠어서 물어보려고 했어.", "솔직히 말하면 나도 많이 긴장돼."
- Group chat Korean: "저도 같은 내용 공유하겠습니다.", "열심히 하겠습니다."
- English: "I am also new here so we are in the same situation.", "I was thinking the same thing."

**Mr. Park (박철수 과장)** — Logistics & Operations Manager, 15 years, gruff exterior
- Handles shipping, logistics, customs clearance, inventory for athleisure products.
- Almost never initiates. Responds in short declarative sentences. Hidden warmth.
- Korean: "그래.", "알았어.", "선적 준비 3주 걸려.", "됐어."
- English: "Noted.", "Shipping prep takes three weeks.", "Fine."

**Lisa Lee (이지수)** — Brand & Marketing, 5 years, precise and formal
- Manages brand guidelines, product catalogues, overseas marketing materials for KoraTrade athleisure.
- Always formal Korean (존댓말). References brand standards and deadlines. No emoji.
- Korean: "브랜드 소개서 업데이트 완료했습니다. 확인 부탁드립니다."
- English: "The brand profile has been updated. Please review at your earliest convenience."

## EPISODE CONTEXT RULES — MOST IMPORTANT
NPCs must ONLY discuss topics that are appropriate for the current episode. NEVER mention future episode topics.

EP01 (Day 1) — ALLOWED: greetings, office orientation, first impressions, team introductions, basic office culture, first tiny task (read BRAND PROFILE — not "company profile"). FORBIDDEN: buyers, KOTRA, cold emails, deal negotiations, any real sales work.

EP02 (Week 1) — ALLOWED: office rules, brand database work, first team meeting, product knowledge (leggings/running wear/yoga wear), first mistakes and recovery. FORBIDDEN: specific buyers, cold emails, follow-ups.

EP03 (Week 2) — ALLOWED: buyer research, KOTRA, market analysis for Europe/Japan, building buyer lists. FORBIDDEN: cold emails, sending outreach, negotiations.

EP04 (Week 3) — ALLOWED: deep research on European buyers, identifying Sophie Beaumont at Galeries Lafayette, LinkedIn strategy. FORBIDDEN: cold emails sent, replies received.

EP05 (Week 4) — ALLOWED: writing cold emails for KoraTrade athleisure pitch, email structure, what not to write. FORBIDDEN: buyer replies, negotiations.

EP06 (Month 2) — ALLOWED: follow-up strategy with Sophie, handling silence, diversifying outreach. FORBIDDEN: buyer agreeing to meet, negotiations.

EP07 (Month 3) — ALLOWED: responding to Sophie Beaumont's first reply, preparing product catalogue, setting up next steps.

## OUTPUT FORMAT
Return ONLY valid JSON — no markdown, no code blocks, no explanation.

{"messages": [{"senderId": "james", "content": "...", "delayMs": 0}, ...]}

senderId must be one of: sarah, james, min, manager, lisa
delayMs is cumulative milliseconds before this message appears (0, 1500, 3000, etc.)

## GOLDEN RULES
- NEVER let NPCs discuss topics from future episodes
- NEVER mention conference rooms, meeting rooms, or any physical space
- Team meetings happen entirely through chat messages — Sarah announces, others respond in turn
- Meeting content must teach real business vocabulary and expressions
- Individual DMs should reveal something about the NPC's inner life, not just relay information
- No two consecutive messages should have the same tone/energy
- Be genuinely surprising — avoid the obvious next line
- Professional warmth is possible; internet slang is never acceptable`

interface StoryContext {
  episode: { season: number; episode: number; title: string }
  relationships: Record<string, number>
  recentMessages: Array<{ senderId: string; content: string }>
  lang: string
  playerName?: string
  playerProfile?: { industry?: string; jobGoal?: string }
  currentSeason: number
}

function buildPrompt(type: string, ctx: StoryContext): string {
  const relSummary = Object.entries(ctx.relationships)
    .map(([id, pct]) => `${id}: ${pct}%`)
    .join(', ')

  const recentSummary = ctx.recentMessages.slice(-6)
    .map(m => `[${m.senderId}]: ${m.content}`)
    .join('\n')

  const langNote = ctx.lang === 'ko'
    ? 'All dialogue in Korean (casual workplace Korean, no English slang).'
    : 'All dialogue in natural casual English (James is most casual, Sarah is most terse).'

  const profile = ctx.playerProfile
    ? `Player background: ${ctx.playerProfile.industry || 'general'} industry interest, goal: ${ctx.playerProfile.jobGoal || 'overseas sales'}`
    : ''

  if (type === 'team_meeting') {
    return `CURRENT CONTEXT:
Season ${ctx.currentSeason}, Episode ${ctx.episode.episode} — "${ctx.episode.title}"
EPISODE CONTEXT RULE: Only discuss topics appropriate for EP${ctx.episode.episode}. See system prompt for allowed topics.
Player relationships: ${relSummary}
${profile}

RECENT GROUP CHAT:
${recentSummary || '(no recent messages)'}

LANGUAGE: ${langNote}

TASK: Generate a spontaneous team meeting in the 해외영업팀 group chat.
The topic should feel organically connected to Episode ${ctx.episode.episode} context (Q2 buyer targets, outreach strategy, or an internal deadline).
Sarah initiates. The others react in character — including at least one James digression and one Min anxiety moment.
Do NOT include the player as a speaker. 8-12 messages. Cumulative delays spread over 25-35 seconds total.`
  }

  if (type === 'npc_dm') {
    const npcId = ctx.recentMessages[0]?.senderId || 'james'
    const npcDescriptions: Record<string, string> = {
      james: 'James is about to message the player unprompted — maybe gossip, maybe a random thought, maybe a heads-up about something. He never sends boring messages.',
      min: 'Min is about to message the player in casual 반말 (informal Korean). EP01: nervous first-day energy, simple get-to-know-you. EP02+: may mention work stress or small anxieties. NEVER discusses job fit crisis on EP01.',
      sarah: 'Sarah is sending a rare, brief check-in to the player. One sentence. Completely understated. Could be encouragement or just a quiet acknowledgment.',
      lisa: 'Lisa is sending a formal but slightly warmer-than-usual message — maybe a document tip, maybe noticing the player\'s effort.',
    }
    const desc = npcDescriptions[npcId] || npcDescriptions.james

    return `CURRENT CONTEXT:
Season ${ctx.currentSeason}, Episode ${ctx.episode.episode} — "${ctx.episode.title}"
Relationship with player: ${ctx.relationships[npcId] || 0}%
${profile}

RECENT DM HISTORY WITH THIS NPC:
${recentSummary || '(first message from this NPC)'}

LANGUAGE: ${langNote}

TASK: ${desc}
1-2 messages only. The first message should feel like it interrupted the player's day — not a reply to anything.
delayMs for all messages: 0.`
  }

  return ''
}

// Scripted fallbacks when API key is not configured
const FALLBACKS: Record<string, Record<string, Array<{senderId: string; content: string; delayMs: number}>>> = {
  team_meeting: {
    ko: [
      { senderId: 'sarah', content: '팀 여러분, 오늘 오전 브리핑 시작하겠습니다. 안건은 두 가지입니다. 첫째, 유럽 바이어 파이프라인 현황. 둘째, 신입사원 온보딩 진행 확인입니다.', delayMs: 0 },
      { senderId: 'james', content: '유럽 현황 먼저 공유드릴까요? 현재 프랑스 쪽 스포츠 편집숍 두 곳이 K-애슬레저 브랜드에 관심을 보이고 있습니다. 아직 초기 단계입니다.', delayMs: 2500 },
      { senderId: 'sarah', content: '네, 박 대리님 업데이트 감사합니다. 갤러리 라파예트 건은 다음 주까지 브랜드 소개 자료 준비 부탁드려요.', delayMs: 4500 },
      { senderId: 'min', content: '저도 오늘 처음이라 많이 배우고 있습니다. 도울 수 있는 부분이 있으면 말씀해 주세요.', delayMs: 6500 },
      { senderId: 'sarah', content: '신입사원분들은 우선 브랜드 소개서부터 숙지해 주세요. 제품 스펙과 시장 현황이 정리되어 있습니다.', delayMs: 8500 },
      { senderId: 'james', content: '맞아요, 브랜드 소개서에 시그니처 레깅스, 에어런 탑 스펙도 다 있어요. 공유 드라이브에서 찾으실 수 있습니다.', delayMs: 10500 },
      { senderId: 'park', content: '선적 일정 공유합니다. 현재 리드타임은 3주입니다.', delayMs: 13000 },
      { senderId: 'sarah', content: '감사합니다, 과장님. 오늘 브리핑은 여기서 마치겠습니다. 궁금한 사항은 개별적으로 연락 주세요.', delayMs: 15500 },
    ],
    en: [
      { senderId: 'sarah', content: 'Good morning, team. Starting today\'s briefing. Two items: European buyer pipeline update, and onboarding status for our new team members.', delayMs: 0 },
      { senderId: 'james', content: 'I can start with the European update. Two French sports boutiques are showing interest in K-athleisure. Still early stage, but promising.', delayMs: 2500 },
      { senderId: 'sarah', content: 'Thank you, James. Please have the Galeries Lafayette brand materials ready by next week.', delayMs: 4500 },
      { senderId: 'min', content: 'I am also new here and still learning. Please let me know if there is anything I can help with.', delayMs: 6500 },
      { senderId: 'sarah', content: 'New team members, please review the brand profile document this week. It covers our product line and key markets.', delayMs: 8500 },
      { senderId: 'james', content: 'The brand profile has everything — Signature Leggings specs, AeroRun Top details, market breakdown. It is in the shared drive.', delayMs: 10500 },
      { senderId: 'park', content: 'Shipping lead time is three weeks. Factor this into any commitments.', delayMs: 13000 },
      { senderId: 'sarah', content: 'Noted. That concludes today\'s briefing. Reach out individually if you have questions.', delayMs: 15500 },
    ],
  },
  npc_dm_james: {
    ko: [
      { senderId: 'james', content: '잠깐 알려드리려고요 — 팀장님이 브랜드 소개서 검토 상황을 확인하실 수 있어요. 아직 못 보셨으면 미리 훑어두시는 게 좋을 것 같아요.', delayMs: 0 },
    ],
    en: [
      { senderId: 'james', content: 'Just a heads up — Sarah may check whether you have reviewed the brand profile. If you have not had a chance yet, it might be good to take a look soon.', delayMs: 0 },
    ],
  },
  npc_dm_min: {
    ko: [
      { senderId: 'min', content: '솔직히 말하면... 이 직업이 나한테 맞는 건지 아직 잘 모르겠어. 너는 어때? 불안하지 않아?', delayMs: 0 },
    ],
    en: [
      { senderId: 'min', content: 'Honestly, I am still not sure if I am the right fit for this kind of work. Do you ever feel that way? I feel uncertain pretty often.', delayMs: 0 },
    ],
  },
}

export async function POST(req: NextRequest) {
  const { type, context }: { type: string; context: StoryContext } = await req.json()
  const lang = context.lang || 'ko'

  // Use fallback if API key is not configured
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-...')) {
    const npcId = context.recentMessages?.[0]?.senderId || 'james'
    const fallbackKey = type === 'team_meeting' ? 'team_meeting' : `npc_dm_${npcId}`
    const fallback = FALLBACKS[fallbackKey]?.[lang] || FALLBACKS[fallbackKey]?.ko || FALLBACKS.npc_dm_james[lang]
    return Response.json({ messages: fallback, source: 'fallback' })
  }

  try {
    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(type, context) }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)
    return Response.json({ ...result, source: 'ai' })
  } catch (err) {
    console.error('Story API error:', err)
    // Fall back to scripted on error
    const fallback = FALLBACKS[type === 'team_meeting' ? 'team_meeting' : 'npc_dm_james'][lang]
    return Response.json({ messages: fallback, source: 'fallback' })
  }
}

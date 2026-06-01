import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

interface PendingMission {
  id: string
  name: string
  nameKr: string
  condition: string
}

interface MissionCheckRequest {
  currentEpisodeId: string
  completedMissions: string[]
  pendingMissions: PendingMission[]
  userMessage: string
  conversationHistory: Array<{ senderId: string; content: string }>
  activeRoomId: string
}

// Fallback regex-based detection when API key is absent
function detectFallback(
  pending: PendingMission[],
  userMsg: string,
  history: Array<{ senderId: string; content: string }>,
  roomId: string,
): string[] {
  const completed: string[] = []
  const msg = userMsg.toLowerCase()
  const allUserMsgs = history.filter(m => m.senderId === 'player').map(m => m.content.toLowerCase())
  const anyUserMsg = [...allUserMsgs, msg].join(' ')

  for (const m of pending) {
    switch (m.id) {
      case 'introduce_to_james':
        if (roomId === 'dm-james' && (
          /my name|i'm |i am |새로 |처음 |안녕|신입|first day|just started|new here/.test(msg)
        )) completed.push(m.id)
        break
      case 'greet_sarah':
        if (roomId === 'dm-sarah' && history.some(h => h.senderId === 'player')) completed.push(m.id)
        break
      case 'send_group_intro':
        if (roomId === 'team-general' && /안녕|hello|hi |처음|신입|새로|반갑|introduce|new/.test(msg)) completed.push(m.id)
        break
      case 'use_expression_1':
        if (/nice to meet|반갑습니다|반가워요|만나서/.test(anyUserMsg)) completed.push(m.id)
        break
      case 'read_company_profile':
        if (/read|opened|봤|열어|소개서|profile/.test(msg)) completed.push(m.id)
        break
      case 'confirm_first_task':
        if (roomId === 'dm-sarah' && /deadline|마감|when|언제|will read|읽겠|understand|알겠|what should/.test(msg)) completed.push(m.id)
        break
      case 'ask_for_clarification':
        if (/clarify|확인|모르겠|could you|explain|다시/.test(msg)) completed.push(m.id)
        break
      case 'apologize_for_mistake':
        if (/sorry|apologize|죄송|사과|잘못/.test(msg)) completed.push(m.id)
        break
      case 'contact_park_manager':
        if (roomId === 'dm-park' && history.some(h => h.senderId === 'player')) completed.push(m.id)
        break
      case 'get_lisa_help':
        if (roomId === 'dm-lisa' && /help|도움|문서|document|서류/.test(msg)) completed.push(m.id)
        break
      case 'attend_team_meeting':
        if (roomId === 'team-general' && /meeting|미팅|회의|agenda|안건/.test(msg)) completed.push(m.id)
        break
    }
  }
  return completed
}

export async function POST(req: NextRequest) {
  const body: MissionCheckRequest = await req.json()
  const { currentEpisodeId, pendingMissions, userMessage, conversationHistory, activeRoomId } = body

  if (!pendingMissions.length) {
    return Response.json({ completedNow: [], reasoning: {} })
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-...')) {
    const completedNow = detectFallback(pendingMissions, userMessage, conversationHistory, activeRoomId)
    return Response.json({ completedNow, reasoning: {}, source: 'fallback' })
  }

  const historyText = conversationHistory
    .slice(-20)
    .map(m => `[${m.senderId === 'player' ? 'USER' : m.senderId.toUpperCase()}]: ${m.content}`)
    .join('\n')

  const missionsText = pendingMissions
    .map(m => `- ID: "${m.id}" | Name: ${m.name} | Condition: ${m.condition}`)
    .join('\n')

  const prompt = `You are a mission tracking system for a business English learning game.

Current episode: ${currentEpisodeId}
Current active chat room: ${activeRoomId}
Pending missions (NOT yet completed):
${missionsText}

Recent conversation:
${historyText}

User just sent: ${userMessage}

For each pending mission, determine if it has now been completed based on the conversation. A mission is complete when the user has genuinely done the thing described, not just mentioned it casually. Be strict but fair.

Respond with JSON only:
{
  "completedNow": ["array of mission IDs that were just completed"],
  "reasoning": {"missionId": "brief explanation"}
}`

  try {
    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)
    return Response.json({ completedNow: result.completedNow ?? [], reasoning: result.reasoning ?? {}, source: 'ai' })
  } catch (err) {
    console.error('Mission check error:', err)
    const completedNow = detectFallback(pendingMissions, userMessage, conversationHistory, activeRoomId)
    return Response.json({ completedNow, reasoning: {}, source: 'fallback' })
  }
}

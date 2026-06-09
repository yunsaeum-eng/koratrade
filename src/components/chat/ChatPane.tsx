'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/hooks/useLanguage'
import { NPCS } from '@/data/npcs'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'

type CharKey = keyof typeof CHARACTER_IMAGES
const getChar = (id: string) => CHARACTER_IMAGES[id as CharKey]
import { UI, HINTS_EP01, HINTS_TASK_TRIGGER, t } from '@/data/dialogues'
import { clockToStr } from '@/hooks/useGameClock'
import { Message } from '@/types'
import HintPopup from './HintPopup'
import DocumentViewer from './DocumentViewer'
import InlineLookup from './InlineLookup'
import EtiquetteToast from '@/components/ui/EtiquetteToast'
import { getCurriculumEpisode } from '@/data/curriculum'
import { MISSION_DEFS } from '@/data/missions'
import { getScript, getScriptMissions, isScriptRoom } from '@/data/scripts'

// ─── helpers ──────────────────────────────────────────────────────────────────

function npcRelType(npcId: string): string {
  const map: Record<string, string> = {
    james: 'friendly senior colleague (3 years senior)',
    sarah: 'team manager (10 years senior)',
    lisa: 'brand & marketing colleague from another department',
    min: 'same-age peer and fellow new hire',
    park: 'logistics & operations manager (15 years senior)',
    sophie: 'overseas buyer from Galeries Lafayette, France (external)',
  }
  return map[npcId] ?? 'colleague'
}

// ─── component ────────────────────────────────────────────────────────────────

export default function ChatPane({ onBack }: { onBack?: () => void }) {
  const { state, dispatch, hydrated } = useGame()
  const { profile } = useAuth()
  const { lang } = useLanguage()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [autoHints, setAutoHints] = useState<typeof HINTS_EP01>([])
  const [openDoc, setOpenDoc] = useState<{ type: string; name: string } | null>(null)
  const [etiquetteTip, setEtiquetteTip] = useState<string | null>(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [grammarNotes, setGrammarNotes] = useState<Record<string, { original: string; corrected: string; explanation: string }>>({})
  const [emailMode, setEmailMode] = useState(false)
  const [emailForm, setEmailForm] = useState({ subject: '', greeting: '', body: '', closing: '' })
  type GradeResult = {
    score: number
    pass: boolean
    topStrength: string
    mainFeedback: string
    revisedOpening?: string
    breakdown: Record<string, { score: number; max: number; comment: string }>
    feedback?: {
      correctedEmail?: string
      errors?: Array<{ original: string; corrected: string; explanation: string }>
      structureFeedback?: { greeting: string; body: string; closing: string }
      vocabularySuggestions?: Array<{ original: string; better: string }>
      overallAdvice?: string
    }
  }
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [gradingEmail, setGradingEmail] = useState(false)
  const [scriptExchangeIdx, setScriptExchangeIdx] = useState(0)
  const [scriptDone, setScriptDone] = useState(false)
  const [documentsSent, setDocumentsSent] = useState<Record<string, Set<string>>>({})


  const bottomRef = useRef<HTMLDivElement>(null)
  const initFiredRef = useRef<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const roomId = state.activeRoomId
  const messages = state.messages[roomId] || []
  const activeRoom = state.rooms.find(r => r.id === roomId)
  const npcId = roomId.startsWith('dm-') ? roomId.replace('dm-', '') : null
  const npc = npcId ? NPCS.find(n => n.id === npcId) : null
  const episodeLabel = `S${state.currentEpisode.season ?? 1}EP${String(state.currentEpisode.episode ?? 1).padStart(2, '0')}`

  // ── Stream a response from /api/chat ──────────────────────────────────────
  const streamNpcResponse = useCallback(async (opts: {
    npcId: string
    roomId: string
    userMessage: string
    isFirstMessage?: boolean
  }) => {
    const { npcId: nid, roomId: rid, userMessage, isFirstMessage } = opts
    const npcRel = state.npcs.find(n => n.id === nid)?.relationship ?? 0

    const history = (state.messages[rid] ?? [])
      .filter(m => m.type === 'text' && m.content.trim())
      .slice(-14)
      .map(m => ({
        role: (m.senderId === 'player' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      }))

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          npcId: nid,
          userMessage,
          conversationHistory: history,
          episodeId: `s${state.currentEpisode.season ?? 1}ep${String(state.currentEpisode.episode ?? 1).padStart(2, '0')}`,
          language: lang === 'ko' ? 'korean' : 'english',
          relationshipLevel: npcRel,
          userProfile: { name: profile?.name ?? '유저' },
          isFirstMessage: !!isFirstMessage,
          gameClockMinutes: state.gameClockMinutes,
          isGroupChat: !rid.startsWith('dm-'),
        }),
      })
      clearTimeout(timer)

      const data = await res.json()
      const content: string = data.content ?? ''
      setIsTyping(false)

      if (content) {
        dispatch({
          type: 'ADD_MESSAGE', roomId: rid,
          message: {
            id: `npc-${Date.now()}`,
            roomId: rid,
            senderId: nid,
            content,
            type: 'text',
            timestamp: new Date(),
            isRead: false,
          },
        })
        detectDocument(userMessage, content)
      }
    } catch {
      clearTimeout(timer)
      setIsTyping(false)
      // Dispatch a character-appropriate fallback so the conversation never goes silent
      const fallbacks: Record<string, string> = {
        james: lang === 'ko' ? '잠깐만요.' : 'One moment.',
        sarah: lang === 'ko' ? '잠시 후 다시 얘기해요.' : "Let's revisit this shortly.",
        min:   lang === 'ko' ? '나도 잠깐.' : 'Give me a moment.',
        lisa:  lang === 'ko' ? '확인해 드릴게요.' : "I will check.",
        park:  lang === 'ko' ? '...' : '...',
        sophie: 'I will review and respond shortly.',
      }
      dispatch({
        type: 'ADD_MESSAGE', roomId: rid,
        message: {
          id: `npc-${Date.now()}`,
          roomId: rid,
          senderId: nid,
          content: fallbacks[nid] ?? (lang === 'ko' ? '잠시만요.' : 'one moment.'),
          type: 'text',
          timestamp: new Date(),
          isRead: false,
        },
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, lang, profile, dispatch, hydrated])

  // Reset NPC greeting tracking when episode changes so each episode gets a fresh greeting
  useEffect(() => {
    initFiredRef.current = new Set()
  }, [state.currentEpisodeId])

  // ── Script mode ────────────────────────────────────────────────────────────
  const episodeId = state.currentEpisodeId ?? 'ep01'
  const scriptData = getScript(roomId, episodeId)
  const scriptMissions = getScriptMissions(roomId, episodeId)
  // Script mode is active when: script exists AND not all its missions are complete AND script not done this session
  const allScriptMissionsDone = scriptMissions.length > 0 && scriptMissions.every(id => state.completedMissionIds.includes(id))
  const inScriptMode = !!scriptData && !allScriptMissionsDone && !scriptDone
  const currentExchange = inScriptMode ? scriptData.exchanges[scriptExchangeIdx] ?? null : null

  // ── Initialize NPC DMs — scripted or AI greeting ─────────────────────────
  useEffect(() => {
    if (!roomId) return
    if (!hydrated) return
    const alreadyHasMessages = (state.messages[roomId]?.length ?? 0) > 0
    if (alreadyHasMessages) return
    if (initFiredRef.current.has(roomId)) return
    initFiredRef.current.add(roomId)

    // Script mode rooms: inject the first NPC line as a chat message
    if (scriptData && !allScriptMissionsDone) {
      const firstExchange = scriptData.exchanges[0]
      if (!firstExchange) return
      const content = lang === 'ko' ? firstExchange.npcLine.ko : firstExchange.npcLine.en
      setTimeout(() => {
        dispatch({
          type: 'ADD_MESSAGE', roomId,
          message: {
            id: `script-${firstExchange.id}-${Date.now()}`,
            roomId,
            senderId: firstExchange.npcId,
            content,
            type: 'text',
            timestamp: new Date(),
            isRead: false,
          },
        })
      }, 600)
      return
    }

    // Free input rooms: AI-generated greeting for DMs only
    if (!npcId || !roomId.startsWith('dm-')) return
    setIsTyping(true)
    const delay = npcId === 'james' ? 800 : 400
    setTimeout(() => {
      streamNpcResponse({
        npcId,
        roomId,
        userMessage: `(SYSTEM: You are ${npcId}. The user just opened your chat for the first time today. Send a natural greeting — 1-2 sentences. No need for them to say anything first. Just reach out naturally based on today's episode context.)`,
        isFirstMessage: true,
      })
    }, delay)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, state.currentEpisodeId])

  // Reset script/session state when room changes
  useEffect(() => {
    setHintOpen(false)
    setBannerDismissed(false)
    setScriptExchangeIdx(0)
    setScriptDone(false)
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Document detection ────────────────────────────────────────────────────
  const detectDocument = useCallback((userMsg: string, npcMsg: string) => {
    const combined = `${userMsg} ${npcMsg}`.toLowerCase()
    const ep = state.currentEpisode.episode

    let docType: string | null = null
    let docName = ''

    if (/브랜드 소개|brand profile|소개 자료|브랜드소개서|회사 소개|company profile/.test(combined)) {
      docType = 'brand_profile'; docName = lang === 'ko' ? '브랜드 소개서.pdf' : 'KoraTrade_Brand_Profile.pdf'
    } else if (/카탈로그|catalogue|catalog/.test(combined) && ep >= 4) {
      docType = 'catalogue'; docName = lang === 'ko' ? '제품 카탈로그.pdf' : 'KoraTrade_Product_Catalogue.pdf'
    } else if (/(바이어 분석|buyer.*report|sophie|galeries)/.test(combined) && ep >= 3) {
      docType = 'buyer_profile_sophie'; docName = lang === 'ko' ? 'Sophie Beaumont 바이어 프로필.pdf' : 'Sophie_Beaumont_Buyer_Profile.pdf'
    } else if (/(이메일 초안|email.*draft|draft.*email|email.*template|이메일 가이드)/.test(combined)) {
      docType = 'email_guide'; docName = lang === 'ko' ? '이메일 작성 가이드.pdf' : 'Email_Writing_Guide.pdf'
    } else if (/(회의 안건|meeting agenda)/.test(combined)) {
      docType = 'meeting_agenda'; docName = lang === 'ko' ? '팀 미팅 안건.docx' : 'Team_Meeting_Agenda.docx'
    }

    if (docType) {
      if (documentsSent[roomId]?.has(docType)) return
      setDocumentsSent(prev => ({
        ...prev,
        [roomId]: new Set([...(prev[roomId] ?? []), docType]),
      }))
      dispatch({
        type: 'ADD_MESSAGE', roomId,
        message: { id: `attach-${Date.now()}`, roomId, senderId: 'system', content: docName, type: 'attachment', attachmentType: docType, attachmentName: docName, timestamp: new Date(), isRead: false } as Message,
      })
    }
  }, [state.currentEpisode.episode, lang, roomId, dispatch, documentsSent])

  // ── Mission detection ─────────────────────────────────────────────────────
  const runMissionCheck = useCallback(async (userMessage: string, activeRoom: string) => {
    const pendingMissions = MISSION_DEFS.filter(
      m => m.episodeId === state.currentEpisodeId && !state.completedMissionIds.includes(m.id)
    ).map(m => ({ id: m.id, name: m.name, nameKr: m.nameKr, condition: m.condition }))

    if (pendingMissions.length === 0) return

    const history = (state.messages[activeRoom] ?? [])
      .filter(m => m.type === 'text')
      .slice(-20)
      .map(m => ({ senderId: m.senderId, content: m.content }))

    try {
      const res = await fetch('/api/mission-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEpisodeId: state.currentEpisodeId,
          completedMissions: state.completedMissionIds,
          pendingMissions,
          userMessage,
          conversationHistory: history,
          activeRoomId: activeRoom,
        }),
      })
      const { completedNow } = await res.json()
      if (Array.isArray(completedNow)) {
        completedNow.forEach((id: string) => dispatch({ type: 'COMPLETE_MISSION', missionId: id }))
      }
    } catch {
      // mission check is best-effort
    }
  }, [state, dispatch])

  // ── Script choice handler ─────────────────────────────────────────────────
  const handleScriptChoice = useCallback((choiceId: string) => {
    if (!currentExchange) return
    const choice = currentExchange.choices.find(c => c.id === choiceId)
    if (!choice) return

    const playerText = lang === 'ko' ? choice.label.ko : choice.label.en
    const npcText = lang === 'ko' ? choice.npcResponse.ko : choice.npcResponse.en

    // Dispatch player's choice as their message (replace [이름]/[name] with actual name)
    const playerName = profile?.name ?? (lang === 'ko' ? '저' : 'me')
    const finalPlayerText = playerText.replace('[이름]', playerName).replace('[name]', playerName)

    dispatch({
      type: 'ADD_MESSAGE', roomId,
      message: { id: `player-${Date.now()}`, roomId, senderId: 'player', content: finalPlayerText, type: 'text', timestamp: new Date(), isRead: true },
    })

    // Affect relationship
    if (choice.relationshipDelta !== 0) {
      dispatch({ type: 'UPDATE_RELATIONSHIP', npcId: currentExchange.npcId, delta: choice.relationshipDelta })
    }

    // Dispatch NPC response after short delay
    setTimeout(() => {
      dispatch({
        type: 'ADD_MESSAGE', roomId,
        message: { id: `script-npc-${Date.now()}`, roomId, senderId: currentExchange.npcId, content: npcText, type: 'text', timestamp: new Date(), isRead: false },
      })

      // Complete associated missions
      if (currentExchange.missionIds) {
        currentExchange.missionIds.forEach(id => dispatch({ type: 'COMPLETE_MISSION', missionId: id }))
      }

      // Run mission check for any additional context-based missions
      runMissionCheck(finalPlayerText, roomId)

      // Advance to next exchange or end script
      const nextIdx = scriptExchangeIdx + 1
      if (scriptData && nextIdx < scriptData.exchanges.length) {
        setScriptExchangeIdx(nextIdx)
        // Inject next NPC line
        const nextExchange = scriptData.exchanges[nextIdx]
        setTimeout(() => {
          dispatch({
            type: 'ADD_MESSAGE', roomId,
            message: { id: `script-${nextExchange.id}-${Date.now()}`, roomId, senderId: nextExchange.npcId, content: lang === 'ko' ? nextExchange.npcLine.ko : nextExchange.npcLine.en, type: 'text', timestamp: new Date(), isRead: false },
          })
        }, 1200)
      } else {
        setScriptDone(true)
      }
    }, 800)
  }, [currentExchange, lang, profile, roomId, scriptExchangeIdx, scriptData, dispatch, runMissionCheck])

  // ── Email submit & grade ──────────────────────────────────────────────────
  const handleSubmitEmail = useCallback(async () => {
    if (!emailForm.subject.trim() || !emailForm.body.trim()) return
    setGradingEmail(true)
    setGradeResult(null)
    setShowScore(false)
    try {
      const res = await fetch('/api/grade-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...emailForm, lang }),
      })
      const result = await res.json()
      setGradeResult(result)
      if (result.pass) {
        // Trigger mission completion
        runMissionCheck('(USER_ACTION: submitted report email with score ' + result.score + ')', roomId)
        // Add a system message showing the submission
        dispatch({
          type: 'ADD_MESSAGE', roomId,
          message: {
            id: `email-${Date.now()}`, roomId, senderId: 'player',
            content: `[이메일 제출] ${emailForm.subject}`,
            type: 'text', timestamp: new Date(), isRead: true,
          },
        })
      }
    } catch {
      // ignore
    } finally {
      setGradingEmail(false)
    }
  }, [emailForm, lang, roomId, runMissionCheck, dispatch])

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim()) return

    // DMs have a fixed npcId; group rooms pick a random participant to respond
    const participants = activeRoom?.participants ?? []
    const responderId = npcId ?? participants[Math.floor(Math.random() * participants.length)] ?? null
    if (!responderId) return

    const userText = input
    const msgId = Date.now().toString()
    dispatch({
      type: 'ADD_MESSAGE', roomId,
      message: { id: msgId, roomId, senderId: 'player', content: userText, type: 'text', timestamp: new Date(), isRead: true },
    })
    dispatch({ type: 'ADD_GAME_MINUTES', amount: 2 })
    dispatch({ type: 'EARN_BADGE', badge: { id: 'first_message', emoji: '💬', name: '첫 대화', nameEn: 'First Words', description: '팀원에게 첫 메시지를 보냈습니다' } })
    setInput('')
    setHintOpen(false)
    inputRef.current?.focus()

    setIsTyping(true)
    streamNpcResponse({ npcId: responderId, roomId, userMessage: userText })

    // Non-blocking mission check — runs after NPC responds so full context is available
    setTimeout(() => runMissionCheck(userText, roomId), 1500)

    // Non-blocking etiquette check (fire and forget)
    const responderNpc = NPCS.find(n => n.id === responderId)
    const npcRel = state.npcs.find(n => n.id === responderId)?.relationship ?? 0
    fetch('/api/etiquette', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage: userText,
        npcName: responderNpc?.name ?? responderId,
        relationshipType: npcRelType(responderId),
        situation: `Episode ${state.currentEpisode.episode}, ${state.currentEpisode.title}`,
        language: lang,
        relationship: npcRel,
      }),
    })
      .then(r => r.json())
      .then(result => {
        if (result.hasIssue && result.severity === 'serious' && result.tip) {
          setEtiquetteTip(result.tip)
        }
      })
      .catch(() => {/* ignore */})

    // Non-blocking grammar check — skip for Sophie (formal email context)
    if (responderId.toLowerCase() !== 'sophie') {
      fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })
        .then(r => r.json())
        .then(result => {
          if (result.hasError && result.original && result.corrected) {
            setGrammarNotes(prev => ({ ...prev, [msgId]: result }))
          }
        })
        .catch(() => {/* ignore */})
    }

  }, [input, roomId, npcId, activeRoom, lang, state, streamNpcResponse, dispatch])

  const getNpcForMessage = (senderId: string) => NPCS.find(n => n.id === senderId)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
        {onBack && (
          <button onClick={onBack} className="md:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl -ml-1"
            style={{ color: '#8a6530', fontSize: 20 }}>←</button>
        )}
        {npc ? (
          <>
            <div className="relative">
              {getChar(npc.id)?.crop
                ? <CharacterAvatar src={getChar(npc.id)!.crop} alt={npc.name} variant="small" size={40}
                    bg={getChar(npc.id)!.bg} border={getChar(npc.id)!.accent} />
                : <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: '#f2efe9' }}>{npc.avatar}</div>
              }
              {npc.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#256040' }} />}
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>{npc.name}</div>
              <div className="text-xs" style={{ color: '#9c8c6e' }}>{npc.roleKr}</div>
            </div>
            <div className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: '#f2efe9', color: '#6b5c3e' }}>
              관계도 {npc.relationship}%
            </div>
          </>
        ) : (
          <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>{activeRoom?.name}</div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Floating learning banner */}
        {!bannerDismissed && (() => {
          const ep = getCurriculumEpisode(state.currentEpisodeId)
          const focus = ep?.objectives?.[0]
          if (!focus) return null
          return (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl border" style={{ background: '#faf5ec', borderColor: '#e8d8b8' }}>
              <span className="text-sm flex-shrink-0">💪</span>
              <span className="text-xs flex-1 leading-relaxed" style={{ color: '#6b5c3e' }}>
                <strong style={{ color: '#8a6530' }}>오늘 목표:</strong> {focus}
              </span>
              <button onClick={() => setBannerDismissed(true)} className="text-xs flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-amber-200" style={{ color: '#9c8c6e' }}>✕</button>
            </div>
          )
        })()}

        {messages.length === 0 && !isTyping && (
          <div className="text-center py-10 text-sm" style={{ color: '#9c8c6e' }}>
            {roomId === 'dm-james' ? t(UI.emptyChatJames, lang) : t(UI.emptyChat, lang)}
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.type === 'system') {
            return (
              <div key={`${msg.id}-${i}`} className="text-center my-3">
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#f2efe9', color: '#9c8c6e' }}>{msg.content}</span>
              </div>
            )
          }

          if (msg.type === 'attachment' && msg.attachmentType) {
            return (
              <div key={`${msg.id}-${i}`} className="flex justify-start my-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border max-w-[80%]" style={{ background: '#faf8f4', borderColor: '#e0d8cc' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#faf5ec' }}>📄</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: '#1a1208' }}>{msg.attachmentName}</div>
                    <div className="text-xs" style={{ color: '#9c8c6e' }}>KoraTrade 문서</div>
                  </div>
                  <button onClick={() => {
                    setOpenDoc({ type: msg.attachmentType!, name: msg.attachmentName! })
                    runMissionCheck(`(USER_ACTION: opened document "${msg.attachmentType}")`, roomId)
                  }}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0" style={{ background: '#8a6530', color: 'white' }}>
                    열어보기
                  </button>
                </div>
              </div>
            )
          }

          const isPlayer = msg.senderId === 'player'
          const senderNpc = getNpcForMessage(msg.senderId)
          const prev = messages[i - 1]
          const isFirstInGroup = !prev || prev.type === 'system' || prev.senderId !== msg.senderId ||
            new Date(msg.timestamp).getTime() - new Date(prev.timestamp).getTime() > 60_000
          const next = messages[i + 1]
          const isLastInTimeGroup = !next || next.type === 'system' || next.senderId !== msg.senderId ||
            (next.gameTimestamp ?? 0) !== (msg.gameTimestamp ?? 0)

          return (
            <div key={`${msg.id}-${i}`} className={`flex items-end gap-2 ${isPlayer ? 'flex-row-reverse' : ''}`}
              style={{ marginTop: isFirstInGroup ? '12px' : '2px' }}>
              {!isPlayer && (
                isFirstInGroup
                  ? (
                    senderNpc && getChar(senderNpc.id)?.crop
                      ? <CharacterAvatar src={getChar(senderNpc.id)!.crop} alt={senderNpc.name} variant="small" size={40} className="self-start mt-0.5"
                          bg={getChar(senderNpc.id)!.bg} border={getChar(senderNpc.id)!.accent} />
                      : <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 self-start mt-0.5" style={{ background: '#f2efe9' }}>{senderNpc?.avatar || '👤'}</div>
                  )
                  : <div className="w-9 flex-shrink-0" />
              )}
              <div className={`flex flex-col max-w-[75%] ${isPlayer ? 'items-end' : 'items-start'}`}>
                <div className={`px-3 py-2 text-sm leading-relaxed ${isPlayer ? 'bubble-player' : 'bubble-npc'}`}>
                  {!isPlayer && isFirstInGroup && senderNpc && (
                    <div className="text-xs font-semibold mb-1" style={{ color: '#8a6530' }}>{senderNpc.name}</div>
                  )}
                  {!isPlayer
                    ? <InlineLookup text={msg.content} episodeNum={state.currentEpisode.episode} lang={lang} senderId={msg.senderId} episodeLabel={episodeLabel} />
                    : msg.content}
                </div>
                {isPlayer && grammarNotes[msg.id] && (
                  <div className="mt-1 px-3 py-1.5 rounded-xl text-xs flex items-start gap-2 max-w-[300px]"
                    style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <span className="flex-shrink-0">💡</span>
                    <div className="flex-1 min-w-0">
                      <span style={{ color: '#92400e' }}>
                        <span className="line-through opacity-60">{grammarNotes[msg.id].original}</span>
                        {' → '}
                        <strong>{grammarNotes[msg.id].corrected}</strong>
                      </span>
                      <div className="mt-0.5" style={{ color: '#78350f' }}>{grammarNotes[msg.id].explanation}</div>
                    </div>
                    <button
                      onClick={() => setGrammarNotes(prev => { const n = { ...prev }; delete n[msg.id]; return n })}
                      className="flex-shrink-0 opacity-40 hover:opacity-100"
                      style={{ color: '#92400e' }}
                    >✕</button>
                  </div>
                )}
                {isLastInTimeGroup && msg.gameTimestamp !== undefined && (
                  <span className="font-mono text-xs mt-0.5 px-0.5" style={{ color: '#9c8c6e' }}>{clockToStr(msg.gameTimestamp)}</span>
                )}
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex items-end gap-2" style={{ marginTop: '2px' }}>
            <div className="w-7 flex-shrink-0" />
            <div className="bubble-npc px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#9c8c6e', animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Hint popup */}
      {hintOpen && <HintPopup hints={autoHints} lang={lang} onClose={() => setHintOpen(false)} />}

      {/* Document viewer */}
      {openDoc && <DocumentViewer docType={openDoc.type} docName={openDoc.name} lang={lang} onClose={() => setOpenDoc(null)} />}

      {/* Script mode choice buttons */}
      {inScriptMode && currentExchange && (
        <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: '#9c8c6e' }}>
            {lang === 'ko' ? '어떻게 대답할까요?' : 'How will you respond?'}
          </div>
          <div className="flex flex-col gap-2">
            {currentExchange.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleScriptChoice(choice.id)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm leading-snug border transition-all hover:border-amber-400"
                style={{ borderColor: '#e0d8cc', background: 'white', color: '#1a1208' }}
              >
                <span className="font-semibold mr-1.5" style={{ color: '#8a6530' }}>{choice.id.toUpperCase()}.</span>
                {lang === 'ko' ? choice.label.ko : choice.label.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {!inScriptMode && <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
          {profile && (() => {
            const userKey = `user_${profile.avatarGender ?? 'female'}` as CharKey
            const userCh = CHARACTER_IMAGES[userKey]
            return (
              <CharacterAvatar
                src={userCh.crop}
                alt="me"
                variant="small"
                size={40}
                bg={userCh.bg}
                border={userCh.accent}
              />
            )
          })()}
          <button onClick={() => { if (!hintOpen) setAutoHints(HINTS_EP01); setHintOpen(h => !h) }}
            title={lang === 'ko' ? '표현 힌트' : 'expression hints'}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-base transition-all"
            style={{ background: hintOpen ? '#faf0dd' : 'transparent', color: hintOpen ? '#8a6530' : '#9c8c6e' }}>
            💡
          </button>
          {roomId === 'dm-sarah' && state.currentEpisode.episode >= 1 && !state.completedMissionIds.includes('write_report_email') && (
            <button onClick={() => setEmailMode(true)}
              title={lang === 'ko' ? '보고 이메일 작성' : 'Write report email'}
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-base transition-all"
              style={{ background: 'transparent', color: '#9c8c6e' }}>
              ✉️
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder={t(UI.inputPlaceholder, lang)}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#1a1208' }}
          />
          <button onClick={handleSend} disabled={!input.trim()}
            className="text-sm font-medium px-3 py-1 rounded-lg transition-all disabled:opacity-40 flex-shrink-0"
            style={{ background: '#8a6530', color: 'white' }}>
            {t(UI.sendButton, lang)}
          </button>
        </div>
        {state.currentEpisode.episode <= 3 && (
          <div className="mt-1.5 text-center text-xs" style={{ color: '#b0a090' }}>
            {lang === 'ko' ? '모르는 단어나 표현이 있으면 바로 물어보세요! 💬' : "Don't understand a term? Just ask! 💬"}
          </div>
        )}
      </div>}

      {/* Email compose modal */}
      {emailMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,18,8,0.6)' }}>
          <div className="w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ background: 'white', maxHeight: '90vh' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{ background: '#faf8f4', borderColor: '#e0d8cc' }}>
              <div className="text-lg">✉️</div>
              <div className="flex-1 font-semibold text-sm" style={{ color: '#1a1208' }}>
                {lang === 'ko' ? '보고 이메일 작성' : 'Write Report Email'}
              </div>
              <button onClick={() => { setEmailMode(false); setGradeResult(null) }} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: '#9c8c6e' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {gradeResult ? (
                <div className="flex flex-col gap-3">
                  {/* Strength */}
                  <div className="rounded-xl p-3" style={{ background: '#f0faf4', border: '1px solid #b8e0c8' }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#256040' }}>
                      {lang === 'ko' ? '✓ 잘한 점' : '✓ Strength'}
                    </div>
                    <div className="text-sm" style={{ color: '#1a1208' }}>{gradeResult.topStrength}</div>
                  </div>

                  {/* Corrected email */}
                  {gradeResult.feedback?.correctedEmail && (
                    <div className="rounded-xl p-3" style={{ background: '#faf5ec', border: '1px solid #e8d8b8' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#8a6530' }}>
                        {lang === 'ko' ? '✏️ 수정된 버전' : '✏️ Corrected Version'}
                      </div>
                      <pre className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: '#6b5c3e', fontFamily: 'inherit' }}>{gradeResult.feedback.correctedEmail}</pre>
                    </div>
                  )}

                  {/* Grammar & errors */}
                  {gradeResult.feedback?.errors && gradeResult.feedback.errors.length > 0 && (
                    <div className="rounded-xl p-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                      <div className="text-xs font-semibold mb-2" style={{ color: '#92400e' }}>
                        {lang === 'ko' ? '🔴 문법 & 언어 오류' : '🔴 Grammar & Language Errors'}
                      </div>
                      <div className="space-y-2">
                        {gradeResult.feedback.errors.map((err, i) => (
                          <div key={i} className="text-xs">
                            <span className="line-through opacity-60" style={{ color: '#c0392b' }}>{err.original}</span>
                            <span style={{ color: '#9c8c6e' }}> → </span>
                            <span className="font-semibold" style={{ color: '#256040' }}>{err.corrected}</span>
                            <div className="mt-0.5" style={{ color: '#6b5c3e' }}>{err.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structure feedback */}
                  {gradeResult.feedback?.structureFeedback && (
                    <div className="rounded-xl p-3" style={{ background: 'white', border: '1px solid #e0d8cc' }}>
                      <div className="text-xs font-semibold mb-2" style={{ color: '#9c8c6e' }}>
                        {lang === 'ko' ? '📐 구조 피드백' : '📐 Structure Feedback'}
                      </div>
                      {(['greeting', 'body', 'closing'] as const).map(key => (
                        <div key={key} className="text-xs mb-1">
                          <span className="font-semibold capitalize" style={{ color: '#8a6530' }}>{key}: </span>
                          <span style={{ color: '#1a1208' }}>{gradeResult.feedback?.structureFeedback?.[key]}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vocabulary suggestions */}
                  {gradeResult.feedback?.vocabularySuggestions && gradeResult.feedback.vocabularySuggestions.length > 0 && (
                    <div className="rounded-xl p-3" style={{ background: '#f0f4ff', border: '1px solid #c7d2fe' }}>
                      <div className="text-xs font-semibold mb-2" style={{ color: '#4338ca' }}>
                        {lang === 'ko' ? '📚 어휘 개선 제안' : '📚 Vocabulary Suggestions'}
                      </div>
                      <div className="space-y-1">
                        {gradeResult.feedback.vocabularySuggestions.map((s, i) => (
                          <div key={i} className="text-xs">
                            <span className="opacity-60" style={{ color: '#6b5c3e' }}>{s.original}</span>
                            <span style={{ color: '#9c8c6e' }}> → </span>
                            <span className="font-semibold" style={{ color: '#4338ca' }}>{s.better}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main feedback */}
                  <div className="rounded-xl p-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#92400e' }}>
                      {lang === 'ko' ? '💡 종합 코멘트' : '💡 Overall Advice'}
                    </div>
                    <div className="text-sm" style={{ color: '#1a1208' }}>
                      {gradeResult.feedback?.overallAdvice || gradeResult.mainFeedback}
                    </div>
                  </div>

                  {/* Revised opening example */}
                  {gradeResult.revisedOpening && (
                    <div className="rounded-xl p-3" style={{ background: '#faf5ec', border: '1px solid #e8d8b8' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#8a6530' }}>
                        {lang === 'ko' ? '✏️ 수정 예시 (첫 문장)' : '✏️ Suggested opening'}
                      </div>
                      <div className="text-sm italic" style={{ color: '#6b5c3e' }}>"{gradeResult.revisedOpening}"</div>
                    </div>
                  )}

                  {/* Detailed breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(gradeResult.breakdown).map(([key, v]) => (
                      <div key={key} className="rounded-lg p-2" style={{ background: 'white', border: '1px solid #e0d8cc' }}>
                        <div className="text-xs" style={{ color: '#9c8c6e' }}>{key}</div>
                        <div className="text-sm font-semibold" style={{ color: v.score >= v.max * 0.7 ? '#256040' : '#92400e' }}>{v.score}/{v.max}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#6b5c3e' }}>{v.comment}</div>
                      </div>
                    ))}
                  </div>

                  {/* Score reveal — only shown after button click */}
                  {!showScore ? (
                    <button
                      onClick={() => setShowScore(true)}
                      className="w-full py-3 rounded-xl text-sm font-semibold"
                      style={{ background: '#8a6530', color: 'white' }}
                    >
                      {lang === 'ko' ? '점수 확인하기 →' : 'See Your Score →'}
                    </button>
                  ) : (
                    <>
                      <div className={`rounded-xl p-4 text-center ${gradeResult.pass ? 'bg-green-50' : 'bg-amber-50'}`}
                        style={{ border: `2px solid ${gradeResult.pass ? '#86efac' : '#fde68a'}` }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: gradeResult.pass ? '#256040' : '#92400e' }}>
                          {lang === 'ko' ? '최종 점수' : 'Final Score'}
                        </div>
                        <div className="text-4xl font-bold" style={{ color: gradeResult.pass ? '#256040' : '#92400e' }}>{gradeResult.score}</div>
                        <div className="text-sm font-medium mt-1" style={{ color: gradeResult.pass ? '#256040' : '#92400e' }}>
                          {gradeResult.pass
                            ? (lang === 'ko' ? '통과! 이메일 발송 가능 ✓' : 'Pass! Email approved ✓')
                            : (lang === 'ko' ? '80점 이상 필요 — 수정해 보세요' : 'Need 80+ to pass — try revising')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!gradeResult.pass && (
                          <button onClick={() => { setGradeResult(null); setShowScore(false) }}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                            style={{ background: '#faf0dd', color: '#8a6530' }}>
                            {lang === 'ko' ? '수정하기' : 'Revise'}
                          </button>
                        )}
                        <button onClick={() => { setEmailMode(false); setGradeResult(null); setShowScore(false); setEmailForm({ subject: '', greeting: '', body: '', closing: '' }) }}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                          style={{ background: gradeResult.pass ? '#256040' : '#e0d8cc', color: gradeResult.pass ? 'white' : '#6b5c3e' }}>
                          {gradeResult.pass ? (lang === 'ko' ? '완료' : 'Done') : (lang === 'ko' ? '닫기' : 'Close')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-xs rounded-xl px-3 py-2" style={{ background: '#faf5ec', color: '#6b5c3e' }}>
                    {lang === 'ko'
                      ? 'Sarah 팀장에게 브랜드 소개서 검토 내용을 보고하는 이메일을 작성하세요. 80점 이상이면 미션 완료!'
                      : 'Write a report email to Sarah about your brand profile review. Score 80+ to complete the mission!'}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: '#8a6530' }}>
                      {lang === 'ko' ? '제목 (Subject)' : 'Subject'}
                    </label>
                    <input value={emailForm.subject} onChange={e => setEmailForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder={lang === 'ko' ? '이메일 제목을 입력하세요' : 'Enter email subject'}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none border"
                      style={{ borderColor: '#e0d8cc', background: '#faf8f4', color: '#1a1208' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: '#8a6530' }}>
                      {lang === 'ko' ? '인사말 (Greeting)' : 'Greeting'}
                    </label>
                    <input value={emailForm.greeting} onChange={e => setEmailForm(p => ({ ...p, greeting: e.target.value }))}
                      placeholder="Dear Sarah,"
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none border"
                      style={{ borderColor: '#e0d8cc', background: '#faf8f4', color: '#1a1208' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: '#8a6530' }}>
                      {lang === 'ko' ? '본문 (Body)' : 'Body'}
                    </label>
                    <textarea value={emailForm.body} onChange={e => setEmailForm(p => ({ ...p, body: e.target.value }))}
                      rows={5}
                      placeholder={lang === 'ko' ? '이메일 본문을 작성하세요...' : 'Write your email body here...'}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none border resize-none"
                      style={{ borderColor: '#e0d8cc', background: '#faf8f4', color: '#1a1208' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: '#8a6530' }}>
                      {lang === 'ko' ? '맺음말 (Closing)' : 'Closing'}
                    </label>
                    <input value={emailForm.closing} onChange={e => setEmailForm(p => ({ ...p, closing: e.target.value }))}
                      placeholder={lang === 'ko' ? 'Best regards, [이름]' : 'Best regards, [Your name]'}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none border"
                      style={{ borderColor: '#e0d8cc', background: '#faf8f4', color: '#1a1208' }} />
                  </div>
                  <button
                    onClick={handleSubmitEmail}
                    disabled={gradingEmail || !emailForm.subject.trim() || !emailForm.body.trim()}
                    className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                    style={{ background: '#8a6530', color: 'white' }}>
                    {gradingEmail
                      ? (lang === 'ko' ? '채점 중...' : 'Grading...')
                      : (lang === 'ko' ? '제출하기' : 'Submit')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Etiquette toast */}
      {etiquetteTip && <EtiquetteToast tip={etiquetteTip} onDone={() => setEtiquetteTip(null)} />}
    </div>
  )
}

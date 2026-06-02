'use client'

import { createContext, useContext, useReducer, useEffect, useState, useRef, useCallback, ReactNode } from 'react'
import { NPC, Message, ChatRoom, Episode, Badge, WorkNote, TITLE_BY_LEVEL } from '@/types'
import { NPCS, GROUP_ROOM } from '@/data/npcs'
import { EP01 } from '@/data/episodes'
import { PHASE_DEFS, getEpisodeExpressions } from '@/data/curriculum'
import {
  saveGameState, loadGameState, updateProfileStats,
  saveChatMessage, loadChatHistory,
  saveRelationships, loadRelationships,
  saveCompletedMission, loadCompletedMissions,
} from '@/services/gameData'

// ─── Persisted shape ──────────────────────────────────────────────────────────

interface PersistedGame {
  xp: number
  level: number
  badges: Badge[]
  workNotes: WorkNote[]
  npcRelationships: Record<string, number>
  episodeProgress: number
  learnedExpressionIds: string[]
  currentSeason: number
  gameClockMinutes: number
  currentPhase: number
  currentEpisodeId: string
  completedEpisodeIds: string[]
  expressionEncounters: Record<string, number>
  chatHistory?: Record<string, Message[]>
  completedMissionIds: string[]
}

const DEFAULT_NOTES: WorkNote[] = [
  { id: 'wn1', type: 'term', content: 'Incoterms', translation: '국제 무역 조건', context: 'FOB, CIF 등 국제 거래 운임·위험 부담 구분 기준', tag: '무역', addedAt: new Date().toISOString(), source: 'auto' },
  { id: 'wn2', type: 'term', content: 'Cold Email', translation: '콜드 이메일', context: '사전 관계 없이 처음 보내는 영업 이메일', tag: '영업', addedAt: new Date().toISOString(), source: 'auto' },
  { id: 'wn3', type: 'term', content: 'Follow-up', translation: '팔로업', context: '이전 연락에 대한 후속 이메일 또는 연락', tag: '영업', addedAt: new Date().toISOString(), source: 'auto' },
]

function buildPersistedGame(state: GameState): PersistedGame {
  return {
    xp: state.xp,
    level: state.level,
    badges: state.badges,
    workNotes: state.workNotes,
    npcRelationships: Object.fromEntries(state.npcs.map(n => [n.id, n.relationship])),
    episodeProgress: state.currentEpisode.progress,
    learnedExpressionIds: state.currentEpisode.expressions.filter(e => e.learned).map(e => e.id),
    currentSeason: state.currentSeason,
    gameClockMinutes: state.gameClockMinutes,
    currentPhase: state.currentPhase,
    currentEpisodeId: state.currentEpisodeId,
    completedEpisodeIds: state.completedEpisodeIds,
    expressionEncounters: state.expressionEncounters,
    completedMissionIds: state.completedMissionIds,
    chatHistory: Object.fromEntries(
      Object.entries(state.messages).map(([room, msgs]) => [room, msgs.slice(-80)])
    ),
  }
}

// ─── State ────────────────────────────────────────────────────────────────────

interface GameState {
  npcs: NPC[]
  rooms: ChatRoom[]
  messages: Record<string, Message[]>
  activeRoomId: string
  currentEpisode: Episode
  xp: number
  level: number
  currentSeason: number
  gameClockMinutes: number   // 540 = 09:00 … 1080 = 18:00
  badges: Badge[]
  workNotes: WorkNote[]
  pendingBadge: Badge | null
  currentPhase: number
  currentEpisodeId: string
  completedEpisodeIds: string[]
  expressionEncounters: Record<string, number>
  completedMissionIds: string[]
  pendingMissionToasts: string[]   // queue of mission IDs to show as toasts
}

type GameAction =
  | { type: 'ADD_MESSAGE'; roomId: string; message: Message }
  | { type: 'SET_ACTIVE_ROOM'; roomId: string }
  | { type: 'CLEAR_ROOM_MESSAGES'; roomId: string }
  | { type: 'LEARN_EXPRESSION'; expressionId: string }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UPDATE_RELATIONSHIP'; npcId: string; delta: number }
  | { type: 'ADVANCE_EPISODE_PROGRESS'; amount: number }
  | { type: 'ADVANCE_SEASON' }
  | { type: 'ADD_GAME_MINUTES'; amount: number }
  | { type: 'RESET_GAME_CLOCK' }
  | { type: 'EARN_BADGE'; badge: Omit<Badge, 'earnedAt'> }
  | { type: 'CLEAR_PENDING_BADGE' }
  | { type: 'ADD_WORK_NOTE'; note: WorkNote }
  | { type: 'UPDATE_WORK_NOTE'; note: WorkNote }
  | { type: 'DELETE_WORK_NOTE'; id: string }
  | { type: 'ADVANCE_PHASE' }
  | { type: 'RECORD_EXPRESSION_ENCOUNTER'; expressionId: string }
  | { type: 'UPDATE_MESSAGE_CONTENT'; roomId: string; msgId: string; content: string }
  | { type: 'SET_EPISODE'; episodeId: string }
  | { type: 'COMPLETE_MISSION'; missionId: string }
  | { type: 'UNDO_MISSION'; missionId: string }
  | { type: 'SHIFT_MISSION_TOAST' }
  | { type: 'HYDRATE'; saved: PersistedGame }

const initialRooms: ChatRoom[] = [
  { ...GROUP_ROOM, lastMessage: '', lastMessageAt: new Date(), unreadCount: 0 },
  { id: 'dm-james', type: 'dm', name: 'James Park',   participants: ['james'], lastMessage: '', unreadCount: 0 },
  { id: 'dm-sarah', type: 'dm', name: 'Sarah Kim',    participants: ['sarah'], lastMessage: '', unreadCount: 0 },
  { id: 'dm-lisa',  type: 'dm', name: 'Lisa Lee',     participants: ['lisa'],  lastMessage: '', unreadCount: 0 },
  { id: 'dm-min',   type: 'dm', name: 'Min Choi',     participants: ['min'],   lastMessage: '', unreadCount: 0 },
  { id: 'dm-park',  type: 'dm', name: '박철수 과장',  participants: ['park'],  lastMessage: '', unreadCount: 0 },
]

function makeInitialState(): GameState {
  return {
    npcs: NPCS.map(n => ({ ...n })),
    rooms: initialRooms,
    activeRoomId: 'dm-james',
    currentEpisode: { ...EP01, progress: 0 },
    xp: 0,
    level: 1,
    currentSeason: 1,
    gameClockMinutes: 540,
    badges: [],
    workNotes: DEFAULT_NOTES,
    pendingBadge: null,
    currentPhase: 1,
    currentEpisodeId: 'ep01',
    completedEpisodeIds: [],
    expressionEncounters: {},
    completedMissionIds: [],
    pendingMissionToasts: [],
    messages: {},
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const existing = state.messages[action.roomId] || []
      // Dedup: skip if a message with this exact ID already exists (guards against
      // React StrictMode double-fire and leftover timeouts from previous init cycles)
      if (existing.some(m => m.id === action.message.id)) return state
      // Stamp in-game time if not already set; nudge clock +1 min per message so
      // consecutive messages within a phase get naturally increasing timestamps.
      const gameTs = action.message.gameTimestamp ?? state.gameClockMinutes
      const stamped: Message = { ...action.message, gameTimestamp: gameTs }
      return {
        ...state,
        gameClockMinutes: Math.min(1080, state.gameClockMinutes + 1),
        messages: { ...state.messages, [action.roomId]: [...existing, stamped] },
        rooms: state.rooms.map(r =>
          r.id === action.roomId
            ? { ...r, lastMessage: stamped.content, lastMessageAt: new Date(), unreadCount: r.id === state.activeRoomId ? 0 : r.unreadCount + 1 }
            : r
        ),
      }
    }
    case 'SET_ACTIVE_ROOM':
      return {
        ...state,
        activeRoomId: action.roomId,
        rooms: state.rooms.map(r => r.id === action.roomId ? { ...r, unreadCount: 0 } : r),
      }
    case 'CLEAR_ROOM_MESSAGES':
      return {
        ...state,
        messages: { ...state.messages, [action.roomId]: [] },
        rooms: state.rooms.map(r => r.id === action.roomId ? { ...r, lastMessage: '', unreadCount: 0 } : r),
      }
    case 'LEARN_EXPRESSION':
      return {
        ...state,
        currentEpisode: {
          ...state.currentEpisode,
          expressions: state.currentEpisode.expressions.map(e =>
            e.id === action.expressionId ? { ...e, learned: !e.learned } : e
          ),
        },
      }
    case 'ADD_XP': {
      const xp = state.xp + action.amount
      return { ...state, xp, level: Math.min(Math.floor(xp / 200) + 1, 10) }
    }
    case 'UPDATE_RELATIONSHIP':
      return {
        ...state,
        npcs: state.npcs.map(n =>
          n.id === action.npcId ? { ...n, relationship: Math.min(100, Math.max(0, n.relationship + action.delta)) } : n
        ),
      }
    case 'ADVANCE_EPISODE_PROGRESS': {
      const newProgress = Math.min(100, state.currentEpisode.progress + action.amount)
      return {
        ...state,
        currentEpisode: { ...state.currentEpisode, progress: newProgress },
      }
    }
    case 'ADD_GAME_MINUTES':
      return { ...state, gameClockMinutes: Math.min(1080, state.gameClockMinutes + action.amount) }
    case 'RESET_GAME_CLOCK':
      return { ...state, gameClockMinutes: 540 }
    case 'ADVANCE_SEASON':
      return { ...state, currentSeason: state.currentSeason + 1 }
    case 'EARN_BADGE': {
      if (state.badges.some(b => b.id === action.badge.id)) return state
      const badge: Badge = { ...action.badge, earnedAt: new Date().toISOString() }
      return { ...state, badges: [...state.badges, badge], pendingBadge: badge }
    }
    case 'CLEAR_PENDING_BADGE':
      return { ...state, pendingBadge: null }
    case 'ADD_WORK_NOTE':
      if (state.workNotes.some(n => n.id === action.note.id)) return state
      return { ...state, workNotes: [action.note, ...state.workNotes] }
    case 'UPDATE_WORK_NOTE':
      return { ...state, workNotes: state.workNotes.map(n => n.id === action.note.id ? action.note : n) }
    case 'DELETE_WORK_NOTE':
      return { ...state, workNotes: state.workNotes.filter(n => n.id !== action.id) }

    case 'ADVANCE_PHASE': {
      const clockAdvance = PHASE_DEFS[state.currentPhase - 1]?.clockAdvance ?? 0

      // Phase 5 complete → mark episode done, unlock next, snap clock to 18:00
      if (state.currentPhase >= 5) {
        const alreadyDone = state.completedEpisodeIds.includes(state.currentEpisodeId)
        const completedEpisodeIds = alreadyDone
          ? state.completedEpisodeIds
          : [...state.completedEpisodeIds, state.currentEpisodeId]

        // Season 1 finale: ep07 → unlock season 2
        const isFinale = state.currentEpisodeId === 'ep07'
        const nextSeason = isFinale ? state.currentSeason + 1 : state.currentSeason

        // Advance to next episode if available
        const epNum = parseInt(state.currentEpisodeId.replace('ep', ''), 10)
        const nextEpId = `ep${String(epNum + 1).padStart(2, '0')}`
        const nextExpressions = getEpisodeExpressions(nextEpId)
        const nextEpisode = nextExpressions.length > 0
          ? { ...state.currentEpisode, id: nextEpId, progress: 0, expressions: nextExpressions }
          : state.currentEpisode

        return {
          ...state,
          completedEpisodeIds,
          currentSeason: nextSeason,
          gameClockMinutes: 1080,
          currentEpisodeId: nextExpressions.length > 0 ? nextEpId : state.currentEpisodeId,
          currentEpisode: nextEpisode,
          currentPhase: 1,
          expressionEncounters: {},
        }
      }

      // Normal phase advance
      return {
        ...state,
        currentPhase: state.currentPhase + 1,
        gameClockMinutes: Math.min(1080, state.gameClockMinutes + clockAdvance),
      }
    }

    case 'RECORD_EXPRESSION_ENCOUNTER': {
      const current = state.expressionEncounters[action.expressionId] ?? 0
      return {
        ...state,
        expressionEncounters: {
          ...state.expressionEncounters,
          [action.expressionId]: current + 1,
        },
      }
    }

    case 'SET_EPISODE': {
      return {
        ...state,
        currentEpisodeId: action.episodeId,
        currentPhase: 1,
        expressionEncounters: {},
        currentEpisode: {
          ...state.currentEpisode,
          progress: 0,
        },
      }
    }

    case 'COMPLETE_MISSION': {
      if (state.completedMissionIds.includes(action.missionId)) return state
      return {
        ...state,
        completedMissionIds: [...state.completedMissionIds, action.missionId],
        pendingMissionToasts: [...state.pendingMissionToasts, action.missionId],
      }
    }
    case 'UNDO_MISSION':
      return {
        ...state,
        completedMissionIds: state.completedMissionIds.filter(id => id !== action.missionId),
      }
    case 'SHIFT_MISSION_TOAST':
      return { ...state, pendingMissionToasts: state.pendingMissionToasts.slice(1) }

    case 'UPDATE_MESSAGE_CONTENT': {
      const existing = state.messages[action.roomId] ?? []
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.roomId]: existing.map(m =>
            m.id === action.msgId ? { ...m, content: action.content } : m
          ),
        },
        // Also update last message preview in room list
        rooms: state.rooms.map(r =>
          r.id === action.roomId ? { ...r, lastMessage: action.content } : r
        ),
      }
    }

    case 'HYDRATE': {
      const s = action.saved
      return {
        ...state,
        npcs: NPCS.map(n => ({ ...n, relationship: s.npcRelationships?.[n.id] ?? n.relationship })),
        xp: s.xp ?? 0,
        level: s.level ?? 1,
        badges: s.badges ?? [],
        workNotes: s.workNotes ?? DEFAULT_NOTES,
        currentSeason: s.currentSeason ?? 1,
        gameClockMinutes: (s.gameClockMinutes ?? 540) >= 1080 ? 540 : (s.gameClockMinutes ?? 540),
        currentPhase: s.currentPhase ?? 1,
        currentEpisodeId: s.currentEpisodeId ?? 'ep01',
        completedEpisodeIds: s.completedEpisodeIds ?? [],
        expressionEncounters: s.expressionEncounters ?? {},
        completedMissionIds: s.completedMissionIds ?? [],
        currentEpisode: {
          ...EP01,
          progress: s.episodeProgress ?? 0,
          expressions: EP01.expressions.map(e => ({
            ...e,
            learned: s.learnedExpressionIds?.includes(e.id) ?? false,
          })),
        },
        messages: s.chatHistory
          ? Object.fromEntries(
              Object.entries(s.chatHistory).map(([room, msgs]) => [
                room,
                (msgs as Message[]).map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
              ])
            )
          : state.messages,
      }
    }

    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface GameContextType {
  state: GameState
  dispatch: (action: GameAction) => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, makeInitialState)
  const [hydrated, setHydrated] = useState(false)
  // Ref mirrors hydrated so syncDispatch closure never goes stale
  const hydratedRef = useRef(false)

  // Load from all Supabase tables on mount and HYDRATE state
  useEffect(() => {
    Promise.all([
      loadGameState(uid).catch(() => null),
      loadChatHistory(uid).catch(() => ({} as Record<string, Message[]>)),
      loadRelationships(uid).catch(() => ({} as Record<string, number>)),
      loadCompletedMissions(uid).catch(() => [] as string[]),
    ]).then(([blob, chatFromTable, relsFromTable, missionsFromTable]) => {
      const saved = (blob ?? {}) as PersistedGame
      // Dedicated tables take priority over blob (unlimited history, always up to date)
      const chatHistory = Object.keys(chatFromTable as Record<string, Message[]>).length > 0
        ? chatFromTable as Record<string, Message[]>
        : saved.chatHistory
      const npcRelationships = Object.keys(relsFromTable as Record<string, number>).length > 0
        ? relsFromTable as Record<string, number>
        : saved.npcRelationships
      const completedMissionIds = (missionsFromTable as string[]).length > 0
        ? missionsFromTable as string[]
        : saved.completedMissionIds
      if (blob || chatHistory || npcRelationships || completedMissionIds) {
        dispatch({ type: 'HYDRATE', saved: { ...saved, chatHistory, npcRelationships, completedMissionIds } as PersistedGame })
      }
      hydratedRef.current = true
      setHydrated(true)
    }).catch(() => {
      hydratedRef.current = true
      setHydrated(true)
    })
  }, [uid])

  // Dispatch wrapper: fires granular Supabase writes for specific actions
  const syncDispatch = useCallback((action: GameAction) => {
    dispatch(action)
    if (!hydratedRef.current) return
    if (action.type === 'ADD_MESSAGE') {
      saveChatMessage(uid, action.roomId, action.message).catch(console.error)
    }
    if (action.type === 'COMPLETE_MISSION') {
      saveCompletedMission(uid, action.missionId).catch(console.error)
    }
  }, [uid])

  // Sync NPC relationships to dedicated table whenever scores change
  useEffect(() => {
    if (!hydrated) return
    const relationships = Object.fromEntries(state.npcs.map(n => [n.id, n.relationship]))
    saveRelationships(uid, relationships).catch(console.error)
  }, [hydrated, uid, state.npcs])

  // Full game state blob save: phase, episode, XP, badges, work notes, expressions
  useEffect(() => {
    if (!hydrated) return
    saveGameState(uid, buildPersistedGame(state)).catch(console.error)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, uid, state.xp, state.level, state.currentSeason, state.gameClockMinutes, state.badges, state.workNotes, state.npcs, state.currentEpisode, state.currentPhase, state.completedEpisodeIds, state.expressionEncounters, state.messages, state.completedMissionIds])

  // Keep profiles table XP/level in sync for cross-device login display
  useEffect(() => {
    if (!hydrated) return
    updateProfileStats(uid, state.xp, state.level).catch(console.error)
  }, [hydrated, uid, state.xp, state.level])

  return <GameContext.Provider value={{ state, dispatch: syncDispatch }}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

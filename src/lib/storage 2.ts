// Unified localStorage layer — single key 'koratrade_user'
// All game state lives here. Nothing else touches localStorage directly.

export interface KoratradeUser {
  profile: {
    name: string
    email: string
    avatar: string
    avatarColor: string
    goal: string
    englishLevel: 'beginner' | 'intermediate' | 'advanced'
    industry: string
  }
  gameState: {
    currentSeason: number
    currentEpisodeId: string
    currentPhase: number
    gameClockMinutes: number
    episodeProgress: number
    learnedExpressionIds: string[]
  }
  progress: {
    completedEpisodes: string[]
    expressionsLearned: string[]
    missionsCompleted: string[]
  }
  relationships: {
    james: number; sarah: number; lisa: number
    min: number; park: number; klaus: number
  }
  stats: {
    xp: number
    level: number
    streakDays: number
    lastLoginDate: string
    badgesEarned: Array<{ id: string; emoji: string; name: string; nameEn: string; description: string; earnedAt: string }>
  }
  notes: {
    terms: Array<{ id: string; content: string; translation?: string; context?: string; tag?: string; addedAt: string; source: 'auto' | 'manual' }>
    expressions: Array<{ id: string; content: string; translation?: string; tag?: string; addedAt: string; source: 'auto' | 'manual' }>
    wrongAnswers: Array<{ id: string; content: string; addedAt: string; source: 'auto' | 'manual' }>
    memos: Array<{ id: string; content: string; addedAt: string; source: 'auto' | 'manual' }>
  }
  chatHistory: Record<string, Array<{
    id: string
    senderId: string
    content: string
    type: string
    timestamp: string
    gameTimestamp?: number
    attachmentType?: string
    attachmentName?: string
  }>>
}

const KEY = 'koratrade_user'
const MAX_MESSAGES_PER_ROOM = 100

export function loadUser(uid: string): KoratradeUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${KEY}_${uid}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveUser(uid: string, user: KoratradeUser): void {
  if (typeof window === 'undefined') return
  try {
    // Trim chat history to avoid storage limits
    const trimmed = { ...user, chatHistory: {} as typeof user.chatHistory }
    for (const [room, msgs] of Object.entries(user.chatHistory)) {
      trimmed.chatHistory[room] = msgs.slice(-MAX_MESSAGES_PER_ROOM)
    }
    localStorage.setItem(`${KEY}_${uid}`, JSON.stringify(trimmed))
  } catch { /* storage full */ }
}

export function defaultUser(email: string): KoratradeUser {
  return {
    profile: { name: '', email, avatar: '🧑‍💼', avatarColor: '#f2efe9', goal: 'job', englishLevel: 'beginner', industry: '' },
    gameState: { currentSeason: 1, currentEpisodeId: 'ep01', currentPhase: 1, gameClockMinutes: 540, episodeProgress: 0, learnedExpressionIds: [] },
    progress: { completedEpisodes: [], expressionsLearned: [], missionsCompleted: [] },
    relationships: { james: 50, sarah: 30, lisa: 20, min: 60, park: 10, klaus: 0 },
    stats: { xp: 0, level: 1, streakDays: 0, lastLoginDate: '', badgesEarned: [] },
    notes: { terms: [], expressions: [], wrongAnswers: [], memos: [] },
    chatHistory: {},
  }
}

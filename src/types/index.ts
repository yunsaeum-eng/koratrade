export type Lang = 'ko' | 'en'
export type AppView = 'chat' | 'notes' | 'profiles' | 'progress'

export interface Badge {
  id: string
  emoji: string
  name: string
  nameEn: string
  description: string
  earnedAt?: string
}

export interface WorkNote {
  id: string
  type: 'term' | 'expression' | 'mistake' | 'memo'
  content: string
  translation?: string
  context?: string
  tag?: string
  addedAt: string
  source: 'auto' | 'manual'
}

export interface ExtendedProfile {
  jobGoal: string
  englishLevel: 'beginner' | 'intermediate' | 'advanced'
  industry: string
  learningReason: string
}

export interface UserProfile {
  uid: string
  email: string
  name: string
  avatar: string  // emoji
  avatarBg: string  // hex color
  avatarGender: 'female' | 'male'
  goal: 'job' | 'work' | 'cert' | 'fun'
  level: number
  xp: number
  title: string
  createdAt: Date
}

export interface NPC {
  id: string
  name: string
  nameKr: string
  role: string
  roleKr: string
  avatar: string
  mood: 'good' | 'neutral' | 'busy' | 'bad'
  moodLabel: string
  relationship: number  // 0-100
  isOnline: boolean
  personality: string
  speechStyle: string
}

export interface Message {
  id: string
  roomId: string
  senderId: string  // npc id or 'player'
  content: string
  type: 'text' | 'system' | 'attachment'
  triggersHint?: boolean
  timestamp: Date
  gameTimestamp?: number  // game-clock minutes (540=09:00 … 1080=18:00)
  isRead: boolean
  // attachment fields
  attachmentType?: string
  attachmentName?: string
}

export interface Choice {
  id: string
  text: string
  effect?: {
    xp?: number
    relationship?: Record<string, number>
  }
}

export interface ChatRoom {
  id: string
  type: 'group' | 'dm'
  name: string
  participants: string[]
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount: number
}

export interface Expression {
  id: string
  english: string
  korean: string
  context: string
  learned: boolean
  xp: number
}

export interface Episode {
  id: string
  season: number
  episode: number
  title: string
  titleKr: string
  date: string
  status: 'locked' | 'active' | 'completed'
  progress: number  // 0-100
  expressions: Expression[]
}

export type EpisodePhaseId = 1 | 2 | 3 | 4 | 5

export interface EpisodePhase {
  id: EpisodePhaseId
  name: string            // e.g. "Morning Briefing"
  nameKr: string          // e.g. "아침 브리핑"
  duration: string        // e.g. "10 min"
  clockAdvance: number    // game-minutes this phase contributes (60/120/150/90/120)
  description: string
}

export interface CurriculumEpisode {
  id: string
  season: number
  episode: number
  title: string
  objectives?: string[]
  estimatedMinutes?: number
  titleKr: string
  synopsis: string
  phases: EpisodePhase[]
  expressions: Expression[]
  unlockRequiresEpisode?: string  // e.g. 'ep01' means this unlocks after ep01 complete
}

export type Goal = 'job' | 'work' | 'cert' | 'fun'

export const GOAL_LABELS: Record<Goal, string> = {
  job: '취업 준비',
  work: '현직 향상',
  cert: '자격증 대비',
  fun: '그냥 재미로',
}

export const TITLE_BY_LEVEL: Record<number, string> = {
  1: 'Intern',
  2: 'Intern',
  3: 'Junior Sales Rep',
  4: 'Junior Sales Rep',
  5: 'Sales Representative',
  6: 'Sales Representative',
  7: 'Senior Sales Rep',
  8: 'Senior Sales Rep',
  9: 'Sales Manager',
  10: 'Senior Manager',
}

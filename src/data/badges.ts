import { Badge } from '@/types'

export const BADGE_DEFS: Record<string, Omit<Badge, 'earnedAt'>> = {
  first_login: {
    id: 'first_login',
    emoji: '🎉',
    name: '첫 출근',
    nameEn: 'First Day',
    description: 'KoraTrade에 처음 입사했습니다',
    descriptionEn: 'You joined KoraTrade for the first time.',
  },
  first_message: {
    id: 'first_message',
    emoji: '💬',
    name: '첫 대화',
    nameEn: 'First Words',
    description: '팀원에게 첫 메시지를 보냈습니다',
    descriptionEn: 'You sent your first message to a teammate.',
  },
  first_expression: {
    id: 'first_expression',
    emoji: '📖',
    name: '표현 습득',
    nameEn: 'Expression Learned',
    description: '첫 비즈니스 표현을 학습했습니다',
    descriptionEn: 'You learned your first business expression.',
  },
  streak_3: {
    id: 'streak_3',
    emoji: '🔥',
    name: '3일 연속',
    nameEn: '3-Day Streak',
    description: '3일 연속 출근했습니다',
    descriptionEn: 'You showed up 3 days in a row.',
  },
  episode_1: {
    id: 'episode_1',
    emoji: '⭐',
    name: '에피소드 완료',
    nameEn: 'Episode Complete',
    description: 'EP01 첫 출근을 완료했습니다',
    descriptionEn: 'You completed EP01 — First Day.',
  },
}

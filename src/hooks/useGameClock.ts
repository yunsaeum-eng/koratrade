'use client'

import { useGame } from '@/contexts/GameContext'

export function clockToStr(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function useGameClock() {
  const { state } = useGame()
  const isEndOfDay = state.gameClockMinutes >= 1080

  return {
    gameMinutes: state.gameClockMinutes,
    timeStr: clockToStr(state.gameClockMinutes),
    isEndOfDay,
  }
}

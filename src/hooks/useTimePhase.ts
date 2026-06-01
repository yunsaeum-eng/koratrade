'use client'

import { useState, useEffect } from 'react'

export type TimePhase = 'pre-work' | 'work' | 'end-of-day'

export function useTimePhase() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const h = now.getHours()
  let phase: TimePhase
  if (h < 9) phase = 'pre-work'
  else if (h >= 18) phase = 'end-of-day'
  else phase = 'work'

  const secondsUntil9 = phase === 'pre-work'
    ? (9 * 3600) - (h * 3600 + now.getMinutes() * 60 + now.getSeconds())
    : 0

  return { phase, now, secondsUntil9 }
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

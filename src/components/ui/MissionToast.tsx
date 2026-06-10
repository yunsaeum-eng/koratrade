'use client'

import { useEffect, useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useLanguage } from '@/hooks/useLanguage'
import { MISSION_DEFS } from '@/data/missions'

export default function MissionToast() {
  const { state, dispatch } = useGame()
  const { isEn } = useLanguage()
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  const missionId = state.pendingMissionToasts[0] ?? null

  useEffect(() => {
    if (!missionId) {
      setVisible(false)
      return
    }
    setVisible(true)
    setAnimating(true)

    const hideTimer = setTimeout(() => {
      setAnimating(false)
    }, 2700)

    const shiftTimer = setTimeout(() => {
      setVisible(false)
      dispatch({ type: 'SHIFT_MISSION_TOAST' })
    }, 3200)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(shiftTimer)
    }
  }, [missionId, dispatch])

  if (!visible || !missionId) return null

  const def = MISSION_DEFS.find(m => m.id === missionId)
  if (!def) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        opacity: animating ? 1 : 0,
        transform: animating ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
        style={{ background: '#1a3a28', color: 'white', minWidth: 240 }}
      >
        <span className="text-xl flex-shrink-0">✅</span>
        <div>
          <div className="text-xs font-semibold opacity-70 mb-0.5">
            {isEn ? 'Mission Complete' : '미션 완료'}
          </div>
          <div className="text-sm font-semibold">{isEn ? def.name : def.nameKr}</div>
          <div className="text-xs opacity-60 mt-0.5">+{def.xp} XP</div>
        </div>
      </div>
    </div>
  )
}

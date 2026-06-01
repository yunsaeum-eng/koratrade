'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import LeftSidebar from './LeftSidebar'
import ChatPane from './ChatPane'
import RightSidebar from './RightSidebar'
import CharacterProfiles from '@/components/profiles/CharacterProfiles'
import WorkNotes from '@/components/notes/WorkNotes'
import SeasonMap from '@/components/progress/SeasonMap'
import UserProfileModal from '@/components/profile/UserProfileModal'
import BadgeToast from '@/components/ui/BadgeToast'
import MissionToast from '@/components/ui/MissionToast'
import EndOfDayScreen from '@/components/time/EndOfDayScreen'
import { useGame } from '@/contexts/GameContext'
import { useGameClock } from '@/hooks/useGameClock'
import { useStoryEngine } from '@/hooks/useStoryEngine'
import { useMissionEngine } from '@/hooks/useMissionEngine'
import { AppView } from '@/types'

export default function MainLayout() {
  const [leftWidth, setLeftWidth] = useState(220)
  const [rightWidth, setRightWidth] = useState(256)
  const [view, setView] = useState<AppView>('chat')
  const [profileOpen, setProfileOpen] = useState(false)
  const [eodDismissed, setEodDismissed] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('kt_eod_date') === new Date().toDateString()
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const { state, dispatch } = useGame()
  const { timeStr, isEndOfDay } = useGameClock()
  useStoryEngine()
  useMissionEngine()

  const isAfterWork = isEndOfDay
  const showEodOverlay = isEndOfDay && !eodDismissed

  const handleDismissEod = () => setEodDismissed(true)

  const clearBadge = useCallback(() => dispatch({ type: 'CLEAR_PENDING_BADGE' }), [dispatch])

  // Earn first_login badge on first mount
  useEffect(() => {
    dispatch({ type: 'EARN_BADGE', badge: { id: 'first_login', emoji: '🎉', name: '첫 출근', nameEn: 'First Day', description: 'KoraTrade에 처음 입사했습니다' } })
  }, [dispatch])

  const startResize = (side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = side === 'left' ? leftWidth : rightWidth
    const onMove = (me: MouseEvent) => {
      const w = Math.min(320, Math.max(160, startWidth + (side === 'left' ? me.clientX - startX : startX - me.clientX)))
      if (side === 'left') setLeftWidth(w)
      else setRightWidth(w)
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const learnedCount = state.currentEpisode.expressions.filter(e => e.learned).length

  return (
    <div ref={containerRef} className="h-screen flex overflow-hidden" style={{ background: '#f2efe9' }}>
      {/* Left sidebar */}
      <div className="flex-shrink-0 flex" style={{ width: leftWidth }}>
        <div className="flex-1 overflow-hidden" style={{ background: '#faf8f4', borderRight: '1px solid #e0d8cc' }}>
          <LeftSidebar view={view} onViewChange={setView} onOpenProfile={() => setProfileOpen(true)} isAfterWork={isAfterWork} gameTimeStr={timeStr} />
        </div>
        <div className="w-1 cursor-col-resize hover:bg-amber-300 transition-colors flex-shrink-0" onMouseDown={e => startResize('left', e)} />
      </div>

      {/* Center pane */}
      <div className="flex-1 min-w-0 flex flex-col" style={{ background: 'white' }}>
        {view === 'chat'     && <ChatPane />}
        {view === 'profiles' && <CharacterProfiles />}
        {view === 'notes'    && <WorkNotes />}
        {view === 'progress' && <SeasonMap />}
      </div>

      {/* Right sidebar — chat view only */}
      {view === 'chat' && (
        <div className="flex-shrink-0 flex" style={{ width: rightWidth }}>
          <div className="w-1 cursor-col-resize hover:bg-amber-300 transition-colors flex-shrink-0" onMouseDown={e => startResize('right', e)} />
          <div className="flex-1 overflow-hidden" style={{ background: '#faf8f4', borderLeft: '1px solid #e0d8cc' }}>
            <RightSidebar />
          </div>
        </div>
      )}

      {/* End-of-day overlay — shown once per day after 6pm, then dismissed */}
      {showEodOverlay && (
        <EndOfDayScreen
          xpTotal={state.xp}
          learnedCount={learnedCount}
          level={state.level}
          onDismiss={handleDismissEod}
        />
      )}

      {/* User profile modal */}
      {profileOpen && <UserProfileModal onClose={() => setProfileOpen(false)} />}

      {/* Badge toast */}
      {state.pendingBadge && <BadgeToast badge={state.pendingBadge} onDone={clearBadge} />}

      {/* Mission completion toast */}
      <MissionToast />
    </div>
  )
}

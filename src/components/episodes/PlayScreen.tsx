'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/contexts/GameContext'
import { useGameClock } from '@/hooks/useGameClock'
import { useLanguage } from '@/hooks/useLanguage'
import { getMissionsForEpisode } from '@/data/missions'
import MainLayout from '@/components/chat/MainLayout'

interface Props {
  episodeId: string
}

export default function PlayScreen({ episodeId }: Props) {
  const { state, dispatch, hydrated } = useGame()
  const { timeStr } = useGameClock()
  const { lang, t } = useLanguage()
  const router = useRouter()

  // Set episode when hydrated (if different from current)
  useEffect(() => {
    if (!hydrated) return
    if (state.currentEpisodeId !== episodeId) {
      dispatch({ type: 'SET_EPISODE', episodeId })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, episodeId])

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#f2efe9' }}>
        <div className="text-sm" style={{ color: '#9c8c6e' }}>Loading...</div>
      </div>
    )
  }

  const missions = getMissionsForEpisode(episodeId)
  const ep = state.currentEpisode

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-b" style={{ background: '#faf8f4', borderColor: '#e0d8cc', minHeight: 48 }}>
        <button
          onClick={() => router.push('/main')}
          className="text-sm font-semibold flex-shrink-0"
          style={{ color: '#8a6530' }}
        >
          {t('backToEpisodes')}
        </button>
        <div className="flex-1 min-w-0 text-center">
          <div className="text-xs font-semibold truncate" style={{ color: '#1a1208' }}>
            EP{String(ep.episode).padStart(2, '0')} · {lang === 'ko' ? ep.titleKr : ep.title}
          </div>
        </div>
        <div className="text-xs font-mono flex-shrink-0 px-2 py-1 rounded" style={{ background: '#faf0dd', color: '#8a6530' }}>
          {timeStr}
        </div>
      </div>

      {/* Mission pills bar */}
      {missions.length > 0 && (
        <div className="flex-shrink-0 overflow-x-auto px-4 py-2 flex gap-2" style={{ background: '#faf8f4', borderBottom: '1px solid #e0d8cc' }}>
          {missions.map(m => {
            const done = state.completedMissionIds.includes(m.id)
            return (
              <span key={m.id}
                className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  background: done ? '#f0faf4' : '#f2efe9',
                  color: done ? '#256040' : '#6b5c3e',
                  border: `1px solid ${done ? '#b8e0c8' : '#e0d8cc'}`,
                }}>
                {done ? '✓ ' : ''}{lang === 'ko' ? m.nameKr : m.name}
              </span>
            )
          })}
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MainLayout embedded />
      </div>
    </div>
  )
}

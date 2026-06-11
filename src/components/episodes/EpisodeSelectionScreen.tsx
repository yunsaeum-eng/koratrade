'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/contexts/GameContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/hooks/useLanguage'
import { CURRICULUM, EPISODE_EMOJI, SEASON_OVERVIEWS } from '@/data/curriculum'
import { getMissionsForEpisode } from '@/data/missions'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'
import { TranslationKey } from '@/data/translations'

type CharKey = keyof typeof CHARACTER_IMAGES

type EpStatus = 'locked' | 'in-progress' | 'completed'

function getEpisodeStatus(
  episodeId: string,
  completedMissionIds: string[],
  completedEpisodeIds: string[],
): EpStatus {
  if (completedEpisodeIds.includes(episodeId)) return 'completed'
  const ep = CURRICULUM.find(e => e.id === episodeId)
  const requiresEp = ep?.unlockRequiresEpisode
  if (requiresEp) {
    const requiredMissions = getMissionsForEpisode(requiresEp)
    const allDone = requiredMissions.length > 0 && requiredMissions.every(m => completedMissionIds.includes(m.id))
    if (!allDone) return 'locked'
  }
  return 'in-progress'
}

export default function EpisodeSelectionScreen() {
  const { state, dispatch, hydrated } = useGame()
  const { profile, logout } = useAuth()
  const { t, lang } = useLanguage()
  const router = useRouter()
  const [activeSeason, setActiveSeason] = useState(1)

  const episodesForSeason = CURRICULUM.filter(e => e.season === activeSeason)

  const handlePlay = (episodeId: string, status: EpStatus) => {
    if (status === 'locked') return
    dispatch({ type: 'SET_EPISODE', episodeId })
    router.push(`/play/${episodeId}`)
  }

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#f2efe9' }}>
        <div className="text-sm" style={{ color: '#9c8c6e' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#f2efe9' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b flex items-center justify-between" style={{ background: 'white', borderColor: '#e0d8cc' }}>
        <div className="font-serif text-xl" style={{ color: '#8a6530' }}>KoraTrade</div>
        {profile && (() => {
          const userKey = `user_${profile.avatarGender ?? 'female'}` as CharKey
          const userCh = CHARACTER_IMAGES[userKey]
          return (
            <button onClick={logout} className="flex items-center gap-2 hover:opacity-80">
              <div className="text-right">
                <div className="text-xs font-medium" style={{ color: '#1a1208' }}>{profile.name}</div>
                <div className="text-xs" style={{ color: '#9c8c6e' }}>Lv.{state.level} · {state.xp} XP</div>
              </div>
              <CharacterAvatar src={userCh.crop} alt={profile.name} variant="small" size={36} bg={userCh.bg} border={userCh.accent} />
            </button>
          )
        })()}
      </div>

      {/* Season tabs */}
      <div className="flex-shrink-0 flex gap-1 px-4 pt-3 pb-0 overflow-x-auto">
        {SEASON_OVERVIEWS.map(s => {
          const isLocked = s.season > 1
          const isActive = activeSeason === s.season
          return (
            <button
              key={s.season}
              onClick={() => setActiveSeason(s.season)}
              className="flex-shrink-0 px-3 py-2 rounded-t-xl text-sm font-semibold transition-all flex items-center gap-1"
              style={{
                background: isActive ? 'white' : 'transparent',
                color: isActive ? (isLocked ? '#9c8c6e' : '#8a6530') : '#9c8c6e',
                borderBottom: isActive ? `2px solid ${isLocked ? '#9c8c6e' : '#8a6530'}` : '2px solid transparent',
                opacity: isLocked && !isActive ? 0.7 : 1,
              }}
            >
              {t('season')} {s.season}{isLocked && ' 🔒'}
            </button>
          )
        })}
      </div>

      {/* Episode list / Season preview */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {activeSeason > 1 && (() => {
          const season = SEASON_OVERVIEWS.find(s => s.season === activeSeason)!
          return (
            <>
              {/* Season header card */}
              <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#e0d8cc' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <span className="text-4xl">{season.badge.emoji}</span>
                    <span className="absolute -top-1 -right-1 text-sm">🔒</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9c8c6e' }}>Season {season.season}</div>
                    <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>
                      {lang === 'ko' ? season.title : season.titleEn}
                    </div>
                    <div className="text-xs" style={{ color: '#9c8c6e' }}>
                      {lang === 'ko' ? season.subtitle : season.subtitleEn}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-3 mt-1" style={{ borderColor: '#f0ece4' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9c8c6e' }}>
                    {lang === 'ko' ? '학습 목표' : 'Learning Objective'}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
                    {lang === 'ko' ? season.objective : season.objectiveEn}
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: '#9c8c6e' }}>
                    <span>{season.badge.emoji}</span>
                    <span>{lang === 'ko' ? `이 시즌 클리어 시 획득: ${season.badge.name}` : `Clear this season to earn: ${season.badge.name}`}</span>
                  </div>
                </div>
              </div>

              {/* Episode preview list */}
              <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9c8c6e' }}>
                {lang === 'ko' ? '에피소드 목록' : 'Episodes'}
              </div>
              {(season.previewEpisodes ?? []).map((title, idx) => (
                <div key={idx} className="bg-white rounded-xl border p-3 flex items-center gap-3" style={{ borderColor: '#e0d8cc', opacity: 0.6 }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: '#f2efe9' }}>🔒</div>
                  <div>
                    <span className="text-xs font-mono font-semibold mr-2" style={{ color: '#9c8c6e' }}>EP{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-sm" style={{ color: '#6b5c3e' }}>{title}</span>
                  </div>
                </div>
              ))}

              <p className="text-center text-xs mt-3" style={{ color: '#9c8c6e' }}>
                {lang === 'ko' ? `시즌 ${season.season - 1} 완료 후 해금` : `Complete Season ${season.season - 1} to unlock`}
              </p>
              <div className="flex justify-center mt-2">
                <span className="text-xs px-4 py-2 rounded-full" style={{ background: '#f2efe9', color: '#9c8c6e' }}>🚧 Coming Soon</span>
              </div>
            </>
          )
        })()}
        {activeSeason === 1 && episodesForSeason.map(ep => {
          const status = getEpisodeStatus(ep.id, state.completedMissionIds, state.completedEpisodeIds)
          const missions = getMissionsForEpisode(ep.id)
          const completedMissions = missions.filter(m => state.completedMissionIds.includes(m.id))
          const earnedXp = completedMissions.reduce((sum, m) => sum + m.xp, 0)
          const totalXp = missions.reduce((sum, m) => sum + m.xp, 0)
          const previewMissions = missions.slice(0, 3)
          const isCurrentEp = state.currentEpisodeId === ep.id

          return (
            <div
              key={ep.id}
              className="bg-white rounded-2xl border overflow-hidden transition-all"
              style={{
                borderColor: status === 'locked' ? '#e0d8cc' : isCurrentEp ? '#8a6530' : '#e0d8cc',
                opacity: status === 'locked' ? 0.55 : 1,
                boxShadow: isCurrentEp ? '0 0 0 2px #8a6530' : 'none',
              }}
            >
              <div className="p-4">
                {/* Episode header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#faf5ec' }}>
                    {status === 'locked' ? '🔒' : (EPISODE_EMOJI[ep.id] ?? '📋')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#8a6530' }}>
                        EP{String(ep.episode).padStart(2, '0')}
                      </span>
                      <StatusBadge status={status} t={t} />
                    </div>
                    <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>
                      {lang === 'ko' ? ep.titleKr : ep.title}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold" style={{ color: '#8a6530' }}>{earnedXp} XP</div>
                    <div className="text-xs" style={{ color: '#9c8c6e' }}>/ {totalXp} XP</div>
                  </div>
                </div>

                {/* Mission preview pills */}
                {previewMissions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {previewMissions.map(m => {
                      const done = state.completedMissionIds.includes(m.id)
                      return (
                        <span key={m.id} className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: done ? '#f0faf4' : '#f2efe9',
                            color: done ? '#256040' : '#6b5c3e',
                            border: `1px solid ${done ? '#b8e0c8' : '#e0d8cc'}`,
                          }}>
                          {done ? '✓ ' : ''}{lang === 'ko' ? m.nameKr : m.name}
                        </span>
                      )
                    })}
                    {missions.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f2efe9', color: '#9c8c6e' }}>
                        +{missions.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action button */}
                {status !== 'locked' && (
                  <button
                    onClick={() => handlePlay(ep.id, status)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#8a6530', color: 'white' }}
                  >
                    {status === 'completed'
                      ? t('reviewEpisode') + ' →'
                      : isCurrentEp
                        ? t('continueEpisode') + ' →'
                        : t('startEpisode') + ' →'}
                  </button>
                )}
              </div>

              {/* XP progress bar */}
              {status !== 'locked' && totalXp > 0 && (
                <div className="h-1" style={{ background: '#f2efe9' }}>
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(earnedXp / totalXp) * 100}%`, background: status === 'completed' ? '#256040' : '#8a6530' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status, t }: { status: EpStatus; t: (k: TranslationKey) => string }) {
  const styles: Record<EpStatus, { bg: string; color: string; label: string }> = {
    locked:      { bg: '#f2efe9', color: '#9c8c6e', label: '🔒' },
    'in-progress': { bg: '#faf5ec', color: '#8a6530', label: '⏳' },
    completed:   { bg: '#f0faf4', color: '#256040', label: '✓' },
  }
  const s = styles[status]
  const labelText = status === 'locked' ? t('locked') : status === 'completed' ? t('completed') : t('inProgress')
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
      style={{ background: s.bg, color: s.color }}>
      {s.label} {labelText}
    </span>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NPCS } from '@/data/npcs'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'
import { EP01 } from '@/data/episodes'
import { CURRICULUM, EPISODE_EMOJI } from '@/data/curriculum'
import { clockToStr } from '@/hooks/useGameClock'
import { loadGameState } from '@/services/gameData'

type CharKey = keyof typeof CHARACTER_IMAGES
const getChar = (id: string) => CHARACTER_IMAGES[id as CharKey]

export default function CommutePage() {
  const { user, profile, loading, profileLoading } = useAuth()
  const router = useRouter()
  const [savedClock, setSavedClock] = useState(540)
  const [gameXp, setGameXp] = useState(0)
  const [gameLevel, setGameLevel] = useState(1)
  const [completedEpIds, setCompletedEpIds] = useState<string[]>([])
  const [currentEpId, setCurrentEpId] = useState('ep01')
  const [mapOpen, setMapOpen] = useState(false)

  useEffect(() => {
    if (loading || profileLoading) return
    if (!user) { router.replace('/'); return }
    if (!profile) { router.replace('/onboarding'); return }
    loadGameState(user.uid).then(saved => {
      if (!saved) return
      const data = saved as Record<string, unknown>
      const clock = (data.gameClockMinutes as number) ?? 540
      setSavedClock(clock >= 1080 ? 540 : clock)
      setGameXp((data.xp as number) ?? 0)
      setGameLevel((data.level as number) ?? 1)
      setCompletedEpIds((data.completedEpisodeIds as string[]) ?? [])
      setCurrentEpId((data.currentEpisodeId as string) ?? 'ep01')
    }).catch(() => {/* ignore */})
  }, [user, profile, loading, profileLoading, router])

  useEffect(() => {
    if (!user) return
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('kt_last_visit')
    const streak = parseInt(localStorage.getItem('kt_streak') || '0')
    if (lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      localStorage.setItem('kt_streak', String(lastVisit === yesterday ? streak + 1 : 1))
      localStorage.setItem('kt_last_visit', today)
    }
  }, [user])

  const isResume = savedClock > 540 && savedClock < 1080
  const displayXp = gameXp || profile?.xp || 0
  const displayLevel = gameLevel || profile?.level || 1

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8e0 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo + game clock */}
        <div className="text-center mb-6">
          <div className="font-serif text-2xl mb-2" style={{ color: '#8a6530' }}>KoraTrade Inc.</div>
          <div className="font-mono text-6xl font-light mb-1" style={{ color: '#1a1208' }}>
            {isResume ? clockToStr(savedClock) : '09:00'}
          </div>
          <div className="text-xs" style={{ color: '#9c8c6e' }}>
            {isResume ? '이전 세션 진행 중 — 이어서 출근하세요' : '오늘의 업무 시작 준비'}
          </div>
        </div>

        {/* Profile */}
        {profile && (() => {
          const userKey = `user_${profile.avatarGender ?? 'female'}` as CharKey
          const userCh = CHARACTER_IMAGES[userKey]
          return (
            <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl bg-white border" style={{ borderColor: '#e0d8cc' }}>
              <CharacterAvatar
                src={userCh.crop}
                alt={profile.name}
                variant="small"
                size={40}
                bg={userCh.bg}
                border={userCh.accent}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate" style={{ color: '#1a1208' }}>{profile.name}</div>
                <div className="text-xs" style={{ color: '#9c8c6e' }}>{profile.title} · Lv.{displayLevel}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold" style={{ color: '#8a6530' }}>{displayXp} XP</div>
                <div className="w-20 h-1.5 rounded-full mt-1" style={{ background: '#e0d8cc' }}>
                  <div className="h-full rounded-full" style={{ background: '#8a6530', width: `${(displayXp % 200) / 200 * 100}%` }} />
                </div>
              </div>
            </div>
          )
        })()}

        {/* Season 1 episode progress */}
        {(() => {
          const s1eps = CURRICULUM.filter(ep => ep.season === 1)
          const doneCount = completedEpIds.filter(id => s1eps.some(e => e.id === id)).length
          const currentEp = s1eps.find(e => e.id === currentEpId) ?? s1eps[0]
          return (
            <div className="bg-white rounded-2xl border p-4 mb-4" style={{ borderColor: '#e0d8cc' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#8a6530' }}>Season 1</span>
                  <span className="text-xs" style={{ color: '#9c8c6e' }}>EP {doneCount}/{s1eps.length} 완료</span>
                </div>
                <button onClick={() => setMapOpen(o => !o)} className="text-xs" style={{ color: '#8a6530' }}>
                  {mapOpen ? '접기' : '전체 보기'}
                </button>
              </div>

              <div className="h-1.5 rounded-full mb-3" style={{ background: '#e0d8cc' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(doneCount / s1eps.length) * 100}%`, background: '#256040' }} />
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl border-2" style={{ borderColor: '#8a6530', background: '#faf5ec' }}>
                <span className="text-2xl">{EPISODE_EMOJI[currentEp.id] ?? '📋'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-semibold" style={{ color: '#8a6530' }}>EP{String(currentEp.episode).padStart(2, '0')}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: '#8a6530', color: 'white' }}>진행중</span>
                  </div>
                  <div className="text-sm font-semibold truncate" style={{ color: '#1a1208' }}>{currentEp.titleKr}</div>
                </div>
              </div>

              {mapOpen && (
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {s1eps.map(ep => {
                    const done = completedEpIds.includes(ep.id)
                    const cur = ep.id === currentEpId
                    const prevDone = !ep.unlockRequiresEpisode || completedEpIds.includes(ep.unlockRequiresEpisode)
                    return (
                      <div key={ep.id} className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl border"
                        style={{
                          borderColor: cur ? '#8a6530' : done ? '#256040' : '#e0d8cc',
                          background: cur ? '#faf5ec' : done ? '#f0faf4' : '#fafafa',
                          opacity: !prevDone ? 0.4 : 1,
                        }}>
                        <span className="text-base">{!prevDone ? '🔒' : (done ? '✅' : (EPISODE_EMOJI[ep.id] ?? '📋'))}</span>
                        <span className="text-xs font-mono" style={{ color: '#9c8c6e' }}>EP{String(ep.episode).padStart(2, '0')}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}

        {/* Team status */}
        <div className="bg-white rounded-2xl border p-4 mb-4" style={{ borderColor: '#e0d8cc' }}>
          <h3 className="text-xs font-semibold mb-3 tracking-wide uppercase" style={{ color: '#9c8c6e' }}>오늘의 팀원 현황</h3>
          <div className="space-y-2.5">
            {NPCS.filter(n => n.isOnline).map(npc => {
              const ch = getChar(npc.id)
              return (
                <div key={npc.id} className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
                  style={{ background: ch?.bg ?? '#f7f5f1' }}>
                  {ch?.crop
                    ? <CharacterAvatar src={ch.crop} alt={npc.name} variant="medium" size={56} height={64}
                        bg={ch.bg} border={ch.accent} />
                    : <div className="flex-shrink-0 rounded-lg flex items-center justify-center text-2xl" style={{ width: 56, height: 64, background: '#f2efe9' }}>{npc.avatar}</div>
                  }
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium" style={{ color: '#1a1208' }}>{npc.name}</span>
                    <span className="text-xs ml-1.5" style={{ color: '#9c8c6e' }}>{npc.roleKr}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f2efe9', color: '#6b5c3e' }}>{npc.moodLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Today's mission */}
        <div className="bg-white rounded-2xl border p-4 mb-5" style={{ borderColor: '#e0d8cc' }}>
          <h3 className="text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: '#9c8c6e' }}>오늘의 미션</h3>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-mono font-semibold flex-shrink-0"
              style={{ background: '#faf5ec', color: '#8a6530', border: '1px solid #e8d8b8' }}>E01</div>
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>
                S{EP01.season}·EP{EP01.episode} — {EP01.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>{EP01.titleKr}</div>
              <div className="text-xs mt-2 leading-relaxed" style={{ color: '#6b5c3e' }}>
                KoraTrade에 첫 출근! James가 자리를 안내해 주고, 오늘의 핵심 표현 5가지를 배워보세요.
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => router.push('/main')}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #8a6530 0%, #a07a3a 100%)' }}
        >
          {isResume ? `이어서 출근하기 (${clockToStr(savedClock)}부터) →` : '출근하기 →'}
        </button>

        <p className="text-center text-xs mt-3" style={{ color: '#9c8c6e' }}>
          KoraTrade Inc. · 해외영업팀 · 09:00 ~ 18:00
        </p>
      </div>
    </div>
  )
}

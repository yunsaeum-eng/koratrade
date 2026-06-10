'use client'

import { useState, useRef, useEffect } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useLanguage } from '@/hooks/useLanguage'
import { CHARACTER_PROFILES } from '@/data/npcProfiles'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'

type CharKey = keyof typeof CHARACTER_IMAGES
const getChar = (id: string) => CHARACTER_IMAGES[id as CharKey]

function RelBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e0d8cc' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 60 ? '#256040' : '#8a6530' }} />
      </div>
      <span className="text-xs font-mono flex-shrink-0" style={{ color: '#9c8c6e' }}>{pct}%</span>
    </div>
  )
}

function LockedTier({ unlockPct, currentPct, isEn }: { unlockPct: number; currentPct: number; isEn: boolean }) {
  return (
    <div className="rounded-xl p-3 flex items-center gap-3 border" style={{ background: '#faf8f4', borderColor: '#e0d8cc' }}>
      <span className="text-lg">🔒</span>
      <span className="text-xs" style={{ color: '#9c8c6e' }}>
        {isEn ? `Unlocks at ${unlockPct}% relationship` : `관계도 ${unlockPct}% 달성 시 공개`}
      </span>
      <div className="ml-auto text-xs font-mono" style={{ color: '#c8b88a' }}>{currentPct}/{unlockPct}%</div>
    </div>
  )
}

export default function CharacterProfiles() {
  const { state } = useGame()
  const { isEn } = useLanguage()
  const [selected, setSelected] = useState<string | null>(null)
  const prevSeason = useRef(state.currentSeason)
  const [justUnlocked, setJustUnlocked] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (state.currentSeason > prevSeason.current) {
      setJustUnlocked(new Set([state.currentSeason]))
      prevSeason.current = state.currentSeason
      setTimeout(() => setJustUnlocked(new Set()), 800)
    }
  }, [state.currentSeason])

  const getRelationship = (npcId: string) => state.npcs.find(n => n.id === npcId)?.relationship ?? 0
  const isUnlocked = (unlockSeason: number) => state.currentSeason >= unlockSeason

  const profile = selected ? CHARACTER_PROFILES.find(p => p.id === selected) : null

  if (profile) {
    const rel = getRelationship(profile.id)
    const unlocked = isUnlocked(profile.unlockSeason)
    const ch = getChar(profile.id)
    const displayName = isEn && profile.id === 'manager' ? 'Mr. Park' : (isEn ? profile.name : profile.nameKr)
    const displayRole = isEn ? profile.role : profile.roleKr
    const displayTags = isEn ? profile.personalityTagsEn : profile.personalityTags
    return (
      <div className="h-full flex flex-col overflow-hidden" style={{ background: 'white' }}>
        <div className="px-5 py-3 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
          <button onClick={() => setSelected(null)} className="text-sm px-2 py-1 rounded-lg hover:bg-gray-100" style={{ color: '#9c8c6e' }}>
            ← {isEn ? 'Back' : '뒤로'}
          </button>
          <span className="font-semibold text-sm" style={{ color: '#1a1208' }}>{profile.nameKr} · {profile.name}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 140, background: ch?.bg ?? '#f2efe9', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.4)' }}>
              {ch?.full
                ? <CharacterAvatar src={ch.full} alt={profile.name} variant="large" />
                : <div className="text-4xl flex items-center justify-center p-4">{profile.avatar}</div>
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold" style={{ color: '#1a1208' }}>{displayName}</span>
                <span>{profile.nationality}</span>
              </div>
              <div className="text-xs mb-2" style={{ color: '#9c8c6e' }}>{displayRole}</div>
              <div className="flex flex-wrap gap-1">
                {displayTags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f2efe9', color: '#6b5c3e' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {unlocked ? (
            <>
              <div className="rounded-xl p-3 border" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: '#9c8c6e' }}>{isEn ? 'Relationship' : '관계도'}</div>
                <RelBar pct={rel} />
              </div>
              <div>
                <div className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9c8c6e' }}>{isEn ? 'About' : '기본 정보'}</div>
                <p className="text-sm leading-relaxed" style={{ color: '#1a1208' }}>{profile.basicInfo}</p>
              </div>
              <div>
                <div className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9c8c6e' }}>{isEn ? 'Work Style' : '업무 스타일'}</div>
                {rel >= profile.tiers.workStyle.minPct
                  ? <p className="text-sm leading-relaxed" style={{ color: '#1a1208' }}>{profile.tiers.workStyle.text}</p>
                  : <LockedTier unlockPct={profile.tiers.workStyle.minPct} currentPct={rel} isEn={isEn} />}
              </div>
              <div>
                <div className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9c8c6e' }}>{isEn ? 'Personal Story' : '개인 이야기'}</div>
                {rel >= profile.tiers.personal.minPct
                  ? <p className="text-sm leading-relaxed" style={{ color: '#1a1208' }}>{profile.tiers.personal.text}</p>
                  : <LockedTier unlockPct={profile.tiers.personal.minPct} currentPct={rel} isEn={isEn} />}
              </div>
              <div>
                <div className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9c8c6e' }}>{isEn ? 'Hidden Narrative' : '숨겨진 서사'}</div>
                {rel >= profile.tiers.secret.minPct
                  ? <div className="rounded-xl p-3 border" style={{ borderColor: '#c8b88a', background: '#faf5ec' }}>
                      <p className="text-sm leading-relaxed secret-shimmer font-medium">{profile.tiers.secret.text}</p>
                    </div>
                  : <LockedTier unlockPct={profile.tiers.secret.minPct} currentPct={rel} isEn={isEn} />}
              </div>
            </>
          ) : (
            <div className="rounded-2xl p-6 text-center border" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1a1208' }}>
                {isEn ? `Unlocks after Season ${profile.unlockSeason}` : `S${profile.unlockSeason} 클리어 후 공개`}
              </div>
              <div className="text-xs" style={{ color: '#9c8c6e' }}>
                {isEn
                  ? `Complete Season ${profile.unlockSeason - 1} to unlock this character`
                  : `시즌 ${profile.unlockSeason - 1}을 완료하면 이 캐릭터가 등장합니다`}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'white' }}>
      <div className="px-5 py-3 border-b flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
        <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>Characters</div>
        <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>
          {isEn ? 'More info unlocks as your relationship grows' : '관계도가 높아질수록 더 많은 정보가 공개됩니다'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {CHARACTER_PROFILES.map(p => {
            const rel = getRelationship(p.id)
            const unlocked = isUnlocked(p.unlockSeason)
            const isAnimating = justUnlocked.has(p.unlockSeason)
            const ch = getChar(p.id)
            const displayRole = isEn ? p.role : p.roleKr
            const displayTags = isEn ? p.personalityTagsEn : p.personalityTags
            const cardName = isEn && p.id === 'manager' ? 'Mr. Park' : p.name

            if (!unlocked) {
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border flex flex-col items-center text-center gap-2"
                  style={{ borderColor: '#e0d8cc', background: '#f8f8f8', opacity: 0.7 }}
                >
                  <div className="rounded-xl overflow-hidden" style={{ width: 120, background: '#f0f0f0', filter: 'grayscale(1)' }}>
                    {ch?.full
                      ? <CharacterAvatar src={ch.full} alt={p.name} variant="large" />
                      : <div className="text-2xl flex items-center justify-center p-4">{p.avatar}</div>
                    }
                  </div>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: '#aaa' }}>{p.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#bbb' }}>{p.nationality}</div>
                  </div>
                  <div className="text-lg">🔒</div>
                  <div className="text-xs px-2 py-1 rounded-lg" style={{ background: '#eee', color: '#999' }}>
                    {isEn ? `Unlocks after Season ${p.unlockSeason}` : `S${p.unlockSeason} 클리어 후 공개`}
                  </div>
                </div>
              )
            }

            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`text-left p-3 rounded-2xl border transition-all hover:border-amber-300 flex flex-col gap-2 ${isAnimating ? 'npc-unlock-anim' : ''}`}
                style={{ borderColor: ch?.accent ?? '#e0d8cc', background: ch?.bg ?? '#faf8f4' }}
              >
                <div className="rounded-xl overflow-hidden mx-auto" style={{ width: 120, background: 'transparent' }}>
                  {ch?.full
                    ? <CharacterAvatar src={ch.full} alt={p.name} variant="large" />
                    : <div className="text-2xl flex items-center justify-center p-4">{p.avatar}</div>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-tight truncate" style={{ color: '#1a1208' }}>{cardName}</div>
                    <div className="text-xs" style={{ color: '#9c8c6e' }}>{p.nationality}</div>
                  </div>
                </div>
                <div className="text-xs leading-tight" style={{ color: '#9c8c6e' }}>{displayRole}</div>
                <RelBar pct={rel} />
                <div className="flex flex-wrap gap-1">
                  {displayTags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#f2efe9', color: '#6b5c3e' }}>{tag}</span>
                  ))}
                  {rel >= p.tiers.secret.minPct && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#faf5ec', color: '#8a6530' }}>✨</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

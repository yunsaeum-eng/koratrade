'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { ExtendedProfile, Badge } from '@/types'
import { BADGE_DEFS } from '@/data/badges'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'
import { resetProgress, deleteUserData, loadExtendedProfile, saveExtendedProfile } from '@/services/gameData'
import { supabase } from '@/lib/supabase'

interface Props { onClose: () => void }

export default function UserProfileModal({ onClose }: Props) {
  const { user, profile } = useAuth()
  const { state } = useGame()
  const [ext, setExt] = useState<ExtendedProfile>({ jobGoal: '', englishLevel: 'beginner', industry: '', learningReason: '' })
  const [saved, setSaved] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleReset = async () => {
    if (!user) return
    await resetProgress(user.uid).catch(console.error)
    window.location.href = '/commute'
  }

  const handleDelete = async () => {
    if (!user) return
    await deleteUserData(user.uid).catch(console.error)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  useEffect(() => {
    if (!profile) return
    loadExtendedProfile(profile.uid).then(loaded => {
      if (loaded) setExt(loaded)
    })
  }, [profile])

  const save = async () => {
    if (!profile) return
    await saveExtendedProfile(profile.uid, ext).catch(console.error)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const allBadgeDefs = Object.values(BADGE_DEFS)
  const earnedIds = new Set(state.badges.map(b => b.id))

  if (!user) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="w-full max-w-md mx-4 rounded-2xl shadow-xl flex flex-col" style={{ background: 'white', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#e0d8cc' }}>
          {profile ? (
            <CharacterAvatar
              src={CHARACTER_IMAGES[`user_${profile.avatarGender ?? 'female'}` as keyof typeof CHARACTER_IMAGES].crop}
              alt={profile.name}
              variant="small"
              size={64}
              bg={CHARACTER_IMAGES[`user_${profile.avatarGender ?? 'female'}` as keyof typeof CHARACTER_IMAGES].bg}
              border={CHARACTER_IMAGES[`user_${profile.avatarGender ?? 'female'}` as keyof typeof CHARACTER_IMAGES].accent}
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex-shrink-0" style={{ background: '#e0d8cc' }} />
          )}
          <div className="flex-1">
            <div className="font-semibold" style={{ color: '#1a1208' }}>{profile?.name ?? '—'}</div>
            <div className="text-xs" style={{ color: '#9c8c6e' }}>{profile ? `${profile.title} · Lv.${profile.level} · ${state.xp} XP` : '로딩 중...'}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: '#9c8c6e' }}>✕</button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          {profile && <>
            {/* Badges */}
            <div className="px-5 py-4 border-b" style={{ borderColor: '#e0d8cc' }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9c8c6e' }}>획득한 배지</div>
              <div className="flex flex-wrap gap-2">
                {allBadgeDefs.map(def => {
                  const earned = earnedIds.has(def.id)
                  const earnedBadge = state.badges.find(b => b.id === def.id)
                  return (
                    <div
                      key={def.id}
                      title={earned ? `${def.description}\n${new Date(earnedBadge!.earnedAt!).toLocaleDateString('ko-KR')}` : `🔒 ${def.description}`}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl border w-16"
                      style={{
                        borderColor: earned ? '#c8b88a' : '#e0d8cc',
                        background: earned ? '#faf5ec' : '#fafafa',
                        opacity: earned ? 1 : 0.4,
                      }}
                    >
                      <span className="text-2xl">{def.emoji}</span>
                      <span className="text-xs text-center leading-tight" style={{ color: earned ? '#8a6530' : '#9c8c6e', fontSize: '10px' }}>
                        {def.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* XP progress */}
            <div className="px-5 py-4 border-b" style={{ borderColor: '#e0d8cc' }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9c8c6e' }}>레벨 현황</div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold" style={{ color: '#1a1208' }}>Lv.{profile.level}</span>
                <span className="text-xs font-mono" style={{ color: '#9c8c6e' }}>{state.xp} / {profile.level * 200} XP</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#e0d8cc' }}>
                <div className="h-full rounded-full transition-all" style={{ background: '#8a6530', width: `${(state.xp % 200) / 200 * 100}%` }} />
              </div>
            </div>

            {/* Extended profile form */}
            <div className="px-5 py-4 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9c8c6e' }}>
                학습 프로필 <span className="normal-case font-normal">(NPC가 자연스럽게 참고합니다)</span>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#6b5c3e' }}>커리어 목표</label>
                <input
                  value={ext.jobGoal}
                  onChange={e => setExt(p => ({ ...p, jobGoal: e.target.value }))}
                  placeholder="예: 자동차 부품 수출 영업, 독일·유럽 바이어 발굴"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#6b5c3e' }}>영어 수준</label>
                <div className="flex gap-2">
                  {[['beginner', '초급'], ['intermediate', '중급'], ['advanced', '고급']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setExt(p => ({ ...p, englishLevel: val as ExtendedProfile['englishLevel'] }))}
                      className="flex-1 py-2 rounded-lg text-sm border-2 font-medium transition-all"
                      style={{
                        borderColor: ext.englishLevel === val ? '#8a6530' : '#e0d8cc',
                        background: ext.englishLevel === val ? '#faf5ec' : 'white',
                        color: ext.englishLevel === val ? '#8a6530' : '#9c8c6e',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#6b5c3e' }}>관심 산업</label>
                <input
                  value={ext.industry}
                  onChange={e => setExt(p => ({ ...p, industry: e.target.value }))}
                  placeholder="예: 자동차 부품, 화장품, 식품, IT 소프트웨어"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#6b5c3e' }}>학습 동기</label>
                <textarea
                  value={ext.learningReason}
                  onChange={e => setExt(p => ({ ...p, learningReason: e.target.value }))}
                  placeholder="예: 해외 전시회에서 바이어와 직접 소통하고 싶어요"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                  style={{ borderColor: '#e0d8cc', background: '#faf8f4', height: '70px' }}
                />
              </div>

              <button
                onClick={save}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: saved ? '#256040' : '#8a6530' }}
              >
                {saved ? '✓ 저장됨' : '저장하기'}
              </button>
            </div>
          </>}
        </div>

        {/* Reset & Delete — pinned at bottom */}
        <div className="flex-shrink-0 px-5 py-3 border-t space-y-2" style={{ borderColor: '#e0d8cc' }}>
          {/* Reset progress */}
          {!resetConfirm && !deleteConfirm && (
            <button
              onClick={() => setResetConfirm(true)}
              className="w-full py-2 rounded-xl text-sm font-medium border-2 transition-all"
              style={{ borderColor: '#e0c8c8', color: '#c0392b', background: 'white' }}
            >
              처음부터 다시 시작
            </button>
          )}
          {resetConfirm && (
            <div className="rounded-xl border-2 p-3 space-y-2" style={{ borderColor: '#e0c8c8', background: '#fff5f5' }}>
              <p className="text-xs text-center font-medium" style={{ color: '#c0392b' }}>정말 모든 진행상황을 초기화할까요?</p>
              <p className="text-xs text-center" style={{ color: '#9c8c6e' }}>에피소드 진행, XP, 관계도가 모두 삭제됩니다. 계정은 유지됩니다.</p>
              <div className="flex gap-2">
                <button onClick={() => setResetConfirm(false)} className="flex-1 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}>취소</button>
                <button onClick={handleReset} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#c0392b' }}>초기화하기</button>
              </div>
            </div>
          )}

          {/* Delete account */}
          {!resetConfirm && !deleteConfirm && (
            <button onClick={() => setDeleteConfirm(true)} className="w-full py-1 text-xs text-center" style={{ color: '#9c8c6e' }}>
              회원 탈퇴
            </button>
          )}
          {deleteConfirm && (
            <div className="rounded-xl border-2 p-3 space-y-2" style={{ borderColor: '#e0c8c8', background: '#fff5f5' }}>
              <p className="text-xs text-center font-medium" style={{ color: '#c0392b' }}>정말 탈퇴하시겠어요?</p>
              <p className="text-xs text-center" style={{ color: '#9c8c6e' }}>모든 데이터가 삭제되며 복구할 수 없습니다.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}>취소</button>
                <button onClick={handleDelete} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#c0392b' }}>탈퇴하기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfile, Goal, GOAL_LABELS } from '@/types'

const GOALS: { key: Goal; emoji: string; desc: string }[] = [
  { key: 'job', emoji: '🎯', desc: '취업 준비 중' },
  { key: 'work', emoji: '💼', desc: '현직 스킬 향상' },
  { key: 'cert', emoji: '📜', desc: '자격증 대비' },
  { key: 'fun', emoji: '🎮', desc: '그냥 재미로' },
]

const GENDER_OPTIONS: { key: 'female' | 'male'; src: string; label: string }[] = [
  { key: 'female', src: CHARACTER_IMAGES.user_female.full, label: '여성 캐릭터' },
  { key: 'male', src: CHARACTER_IMAGES.user_male.full, label: '남성 캐릭터' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatarGender, setAvatarGender] = useState<'female' | 'male' | null>(null)
  const [goal, setGoal] = useState<Goal>('job')
  const [showOfferLetter, setShowOfferLetter] = useState(false)
  const { user, setProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/')
  }, [loading, user, router])

  const handleFinish = () => {
    if (!user || !avatarGender) return
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      name,
      avatar: avatarGender === 'female' ? '👩‍💼' : '🧑‍💼',
      avatarBg: '#f2efe9',
      avatarGender,
      goal,
      level: 1,
      xp: 0,
      title: 'Intern',
      createdAt: new Date(),
    }
    setProfile(profile)
    setShowOfferLetter(true)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#f2efe9' }}>
        <div className="text-sm" style={{ color: '#9c8c6e' }}>Loading...</div>
      </div>
    )
  }

  if (showOfferLetter) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const formattedDate = `${year}년 ${month}월 ${day}일`

    return (
      <div className="min-h-full flex items-center justify-center p-4" style={{ background: '#f2efe9' }}>
        <div className="max-w-sm w-full">
          <div className="bg-white rounded-2xl p-8 shadow-sm border text-center" style={{ borderColor: '#e0d8cc' }}>
            <div className="text-4xl mb-4">🎉</div>
            <div className="font-serif text-2xl mb-1" style={{ color: '#8a6530' }}>합격을 축하드립니다!</div>
            <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>KoraTrade Inc. 해외영업팀</p>
            <div className="border rounded-xl p-5 mb-5 text-left" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
              <div className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#9c8c6e' }}>Offer Letter</div>
              <p className="text-sm leading-relaxed" style={{ color: '#1a1208' }}>
                <strong>{name}</strong> 님,<br /><br />
                KoraTrade Inc. 해외영업팀 Junior Sales Representative로 채용됨을 알려드립니다.<br /><br />
                입사 예정일: <strong>{formattedDate} 월요일 09:00</strong><br />
                부서: 해외영업팀<br />
                직급: Junior Sales Representative<br /><br />
                <span style={{ color: '#9c8c6e', fontSize: '11px' }}>작성일: {formattedDate}</span>
              </p>
            </div>
            <button
              onClick={() => router.push('/commute')}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: '#8a6530' }}
            >
              첫 출근하기 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4" style={{ background: '#f2efe9' }}>
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="font-serif text-2xl" style={{ color: '#8a6530' }}>KoraTrade Inc.</div>
          <p className="text-sm mt-1" style={{ color: '#9c8c6e' }}>입사 지원서</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= step ? '#8a6530' : '#e0d8cc' }} />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e0d8cc' }}>
          {step === 0 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>이름이 뭐예요?</h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>팀원들이 부를 이름을 알려주세요</p>
              <input
                type="text"
                placeholder="예: 김지훈, Alex, ..."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                autoFocus
              />
              <button
                onClick={() => name.trim() && setStep(1)}
                disabled={!name.trim()}
                className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: '#8a6530' }}
              >
                다음 →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>캐릭터를 선택해요</h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>게임에서 사용할 캐릭터를 고르세요</p>

              <div className="flex gap-3 justify-center mb-5">
                {GENDER_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setAvatarGender(opt.key)}
                    className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: avatarGender === opt.key ? '#8a6530' : '#e0d8cc',
                      background: avatarGender === opt.key ? '#faf5ec' : 'white',
                    }}
                  >
                    <div style={{ width: 100 }}>
                      <CharacterAvatar src={opt.src} alt={opt.label} variant="large" />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: avatarGender === opt.key ? '#8a6530' : '#6b5c3e' }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => avatarGender && setStep(2)}
                disabled={!avatarGender}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: '#8a6530' }}
              >
                다음 →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>학습 목표가 뭐예요?</h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>맞춤 스토리 구성에 활용돼요</p>
              <div className="space-y-2">
                {GOALS.map(g => (
                  <button key={g.key} onClick={() => setGoal(g.key)}
                    className="w-full px-4 py-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all"
                    style={{ borderColor: goal === g.key ? '#8a6530' : '#e0d8cc', background: goal === g.key ? '#faf5ec' : 'white' }}
                  >
                    <span className="text-xl">{g.emoji}</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#1a1208' }}>{GOAL_LABELS[g.key]}</div>
                      <div className="text-xs" style={{ color: '#9c8c6e' }}>{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={handleFinish} className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white" style={{ background: '#8a6530' }}>
                지원서 제출 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

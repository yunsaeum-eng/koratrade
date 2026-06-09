'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'
import { useAuth } from '@/contexts/AuthContext'
import { saveProfile } from '@/services/gameData'
import { UserProfile, Goal, GOAL_LABELS } from '@/types'
import { UILang } from '@/data/translations'

const GOALS: { key: Goal; emoji: string; desc: string }[] = [
  { key: 'job', emoji: '🎯', desc: '취업 준비 중 / Job hunting' },
  { key: 'work', emoji: '💼', desc: '현직 스킬 향상 / Skill upgrade' },
  { key: 'cert', emoji: '📜', desc: '자격증 대비 / Certification' },
  { key: 'fun', emoji: '🎮', desc: '그냥 재미로 / Just for fun' },
]

const GENDER_OPTIONS: { key: 'female' | 'male'; src: string; label: string }[] = [
  { key: 'female', src: CHARACTER_IMAGES.user_female.full, label: '여성 캐릭터' },
  { key: 'male', src: CHARACTER_IMAGES.user_male.full, label: '남성 캐릭터' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [uiLang, setUiLang] = useState<UILang>('korean')
  const [name, setName] = useState('')
  const [avatarGender, setAvatarGender] = useState<'female' | 'male' | null>(null)
  const [goal, setGoal] = useState<Goal>('job')
  const [showOfferLetter, setShowOfferLetter] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { user, setProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/')
  }, [loading, user, router])

  const isEn = uiLang === 'english'

  const handleFinish = async () => {
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
      uiLanguage: uiLang,
    }
    setSaving(true)
    setSaveError('')
    // Save ui_lang to localStorage immediately
    localStorage.setItem('kt_ui_lang', uiLang)
    localStorage.setItem('kt_lang', uiLang === 'english' ? 'en' : 'ko')
    try {
      await saveProfile(profile)
      setProfile(profile)
      setShowOfferLetter(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
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
    const formattedDate = isEn ? `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` : `${year}년 ${month}월 ${day}일`

    return (
      <div className="min-h-full flex items-center justify-center p-4" style={{ background: '#f2efe9' }}>
        <div className="max-w-sm w-full">
          <div className="bg-white rounded-2xl p-8 shadow-sm border text-center" style={{ borderColor: '#e0d8cc' }}>
            <div className="text-4xl mb-4">🎉</div>
            <div className="font-serif text-2xl mb-1" style={{ color: '#8a6530' }}>
              {isEn ? 'Congratulations!' : '합격을 축하드립니다!'}
            </div>
            <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>KoraTrade Inc. {isEn ? 'International Sales Team' : '해외영업팀'}</p>
            <div className="border rounded-xl p-5 mb-5 text-left" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
              <div className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#9c8c6e' }}>Offer Letter</div>
              <p className="text-sm leading-relaxed" style={{ color: '#1a1208' }}>
                {isEn ? (
                  <>
                    Dear <strong>{name}</strong>,<br /><br />
                    We are pleased to inform you that you have been selected for the position of Junior Sales Representative at KoraTrade Inc.<br /><br />
                    Start date: <strong>{formattedDate} Monday 09:00</strong><br />
                    Department: International Sales<br />
                    Title: Junior Sales Representative<br /><br />
                    <span style={{ color: '#9c8c6e', fontSize: '11px' }}>Date: {formattedDate}</span>
                  </>
                ) : (
                  <>
                    <strong>{name}</strong> 님,<br /><br />
                    KoraTrade Inc. 해외영업팀 Junior Sales Representative로 채용됨을 알려드립니다.<br /><br />
                    입사 예정일: <strong>{formattedDate} 월요일 09:00</strong><br />
                    부서: 해외영업팀<br />
                    직급: Junior Sales Representative<br /><br />
                    <span style={{ color: '#9c8c6e', fontSize: '11px' }}>작성일: {formattedDate}</span>
                  </>
                )}
              </p>
            </div>
            <button
              onClick={() => router.push('/commute')}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: '#8a6530' }}
            >
              {isEn ? 'Start First Day →' : '첫 출근하기 →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const TOTAL_STEPS = 4

  return (
    <div className="min-h-full flex items-center justify-center p-4" style={{ background: '#f2efe9' }}>
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="font-serif text-2xl" style={{ color: '#8a6530' }}>KoraTrade Inc.</div>
          <p className="text-sm mt-1" style={{ color: '#9c8c6e' }}>
            {isEn ? 'Application Form' : '입사 지원서'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= step ? '#8a6530' : '#e0d8cc' }} />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e0d8cc' }}>
          {/* Step 0: Language */}
          {step === 0 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>
                학습 언어를 선택하세요 / Choose your interface language
              </h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>UI, hints, and feedback will be in this language</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setUiLang('korean')}
                  className="flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all"
                  style={{
                    borderColor: uiLang === 'korean' ? '#8a6530' : '#e0d8cc',
                    background: uiLang === 'korean' ? '#faf5ec' : 'white',
                  }}
                >
                  <span className="text-3xl">🇰🇷</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: uiLang === 'korean' ? '#8a6530' : '#1a1208' }}>한국어</div>
                    <div className="text-xs" style={{ color: '#9c8c6e' }}>Korean UI</div>
                  </div>
                </button>
                <button
                  onClick={() => setUiLang('english')}
                  className="flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all"
                  style={{
                    borderColor: uiLang === 'english' ? '#8a6530' : '#e0d8cc',
                    background: uiLang === 'english' ? '#faf5ec' : 'white',
                  }}
                >
                  <span className="text-3xl">🌏</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: uiLang === 'english' ? '#8a6530' : '#1a1208' }}>English</div>
                    <div className="text-xs" style={{ color: '#9c8c6e' }}>English UI</div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white"
                style={{ background: '#8a6530' }}
              >
                {isEn ? 'Next →' : '다음 →'}
              </button>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>
                {isEn ? "What's your name?" : '이름이 뭐예요?'}
              </h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>
                {isEn ? 'Your name as your teammates will call you' : '팀원들이 부를 이름을 알려주세요'}
              </p>
              <input
                type="text"
                placeholder={isEn ? 'e.g. Alex, Kim, ...' : '예: 김지훈, Alex, ...'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                autoFocus
              />
              <button
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
                className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: '#8a6530' }}
              >
                {isEn ? 'Next →' : '다음 →'}
              </button>
            </div>
          )}

          {/* Step 2: Character */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>
                {isEn ? 'Choose your character' : '캐릭터를 선택해요'}
              </h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>
                {isEn ? 'Select your in-game avatar' : '게임에서 사용할 캐릭터를 고르세요'}
              </p>

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
                      {isEn ? (opt.key === 'female' ? 'Female character' : 'Male character') : opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => avatarGender && setStep(3)}
                disabled={!avatarGender}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: '#8a6530' }}
              >
                {isEn ? 'Next →' : '다음 →'}
              </button>
            </div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <div>
              <h2 className="font-semibold mb-1" style={{ color: '#1a1208' }}>
                {isEn ? "What's your learning goal?" : '학습 목표가 뭐예요?'}
              </h2>
              <p className="text-xs mb-4" style={{ color: '#9c8c6e' }}>
                {isEn ? 'Used to personalize your story' : '맞춤 스토리 구성에 활용돼요'}
              </p>
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
              {saveError && <p className="text-xs text-red-500 mt-2">{saveError}</p>}
              <button onClick={handleFinish} disabled={saving} className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: '#8a6530' }}>
                {saving
                  ? (isEn ? 'Saving...' : '저장 중...')
                  : (isEn ? 'Submit Application 🎉' : '지원서 제출 🎉')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

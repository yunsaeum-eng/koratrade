'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { updateUiLanguage } from '@/services/gameData'

export default function LanguageSelectPage() {
  const [uiLang, setUiLang] = useState<'korean' | 'english'>('korean')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { user, profile, setProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/'); return }
    if (!profile || !profile.name?.trim()) { router.replace('/onboarding'); return }
    // Already has a language set — skip this step
    if (profile.uiLanguage) { router.replace('/commute'); return }
  }, [loading, user, profile, router])

  const handleConfirm = async () => {
    if (!user || !profile) return
    setSaving(true)
    setSaveError('')
    localStorage.setItem('kt_ui_lang', uiLang)
    localStorage.setItem('kt_lang', uiLang === 'english' ? 'en' : 'ko')
    try {
      await updateUiLanguage(user.uid, uiLang)
      setProfile({ ...profile, uiLanguage: uiLang })
      router.push('/commute')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.')
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

  return (
    <div className="min-h-full flex items-center justify-center p-4" style={{ background: '#f2efe9' }}>
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="font-serif text-2xl" style={{ color: '#8a6530' }}>KoraTrade Inc.</div>
          <p className="text-sm mt-1" style={{ color: '#9c8c6e' }}>Welcome back!</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e0d8cc' }}>
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
          {saveError && <p className="text-xs text-red-500 mt-2">{saveError}</p>}
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: '#8a6530' }}
          >
            {saving ? '저장 중... / Saving...' : '확인 / Confirm →'}
          </button>
        </div>
      </div>
    </div>
  )
}

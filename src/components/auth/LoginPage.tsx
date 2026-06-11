'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { loadProfile } from '@/services/gameData'
import { UILang } from '@/data/translations'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uiLang, setUiLang] = useState<UILang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kt_ui_lang') as UILang) || 'korean'
    }
    return 'korean'
  })
  const { signInWithEmail, signUpWithEmail, setProfile } = useAuth()
  const router = useRouter()

  const isEn = uiLang === 'english'

  const saveLang = (lang: UILang) => {
    setUiLang(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('kt_ui_lang', lang)
      localStorage.setItem('kt_lang', lang === 'english' ? 'en' : 'ko')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const existing = await loadProfile(session.user.id).catch(() => null)
          localStorage.setItem('kt_ui_lang', uiLang)
          localStorage.setItem('kt_lang', uiLang === 'english' ? 'en' : 'ko')
          const hasName = !!(existing && existing.name?.trim())
          if (hasName && existing) {
            setProfile({ ...existing, uiLanguage: uiLang })
            router.push('/commute')
          } else {
            router.push('/onboarding')
          }
        }
      } else {
        await signUpWithEmail(email, password)
        localStorage.setItem('kt_ui_lang', uiLang)
        localStorage.setItem('kt_lang', uiLang === 'english' ? 'en' : 'ko')
        router.push('/onboarding')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (isEn ? 'An error occurred.' : '오류가 발생했습니다.'))
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f2efe9 0%, #ede8e0 100%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl mb-1" style={{ color: '#8a6530' }}>KoraTrade</h1>
          <p className="text-sm" style={{ color: '#9c8c6e' }}>Business English Simulator</p>
          <div className="mt-3 text-xs px-3 py-1 rounded-full inline-block" style={{ background: '#e8e0d0', color: '#6b5c3e' }}>
            {isEn ? '📋 Applying for Overseas Sales Team' : '📋 해외영업팀 채용 지원 중'}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#e0d8cc' }}>
          {/* Language toggle */}
          <div className="flex rounded-lg mb-4 p-1" style={{ background: '#f2efe9' }}>
            {(['korean', 'english'] as UILang[]).map(lang => (
              <button
                key={lang}
                onClick={() => saveLang(lang)}
                className="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                style={uiLang === lang
                  ? { background: 'white', color: '#8a6530', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                  : { color: '#9c8c6e' }}
              >
                {lang === 'korean' ? '🇰🇷 한국어' : '🌏 English'}
              </button>
            ))}
          </div>

          {/* Login / Signup tabs */}
          <div className="flex rounded-lg mb-5 p-1" style={{ background: '#f2efe9' }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                style={mode === m
                  ? { background: 'white', color: '#8a6530', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                  : { color: '#9c8c6e' }}
              >
                {m === 'login' ? (isEn ? 'Login' : '로그인') : (isEn ? 'Sign up' : '회원가입')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder={isEn ? 'Email' : '이메일'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
              style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
            />
            <input
              type="password"
              placeholder={isEn ? 'Password (min. 6 chars)' : '비밀번호 (6자 이상)'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
              style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: '#8a6530' }}
            >
              {submitting
                ? (isEn ? 'Processing...' : '처리 중...')
                : mode === 'login'
                  ? (isEn ? 'Log in →' : '입사하기 →')
                  : (isEn ? 'Apply →' : '지원서 제출 →')}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#9c8c6e' }}>
          {isEn ? 'Your data is securely stored in the cloud' : '데이터는 안전하게 클라우드에 저장됩니다'}
        </p>
      </div>
    </div>
  )
}

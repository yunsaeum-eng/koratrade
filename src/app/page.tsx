'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  // Only auto-redirect fully onboarded users (stored session + profile).
  // Everyone else — including users with a session but no profile — must go
  // through the login form so LoginPage can route them explicitly.
  useEffect(() => {
    if (loading) return
    console.log('[PAGE] auth resolved — user:', user?.uid ?? 'null', '| profile:', profile ? profile.name : 'null')
    const profileComplete = !!(profile && profile.name && profile.name.trim() !== '')
    if (user && profileComplete && profile!.uiLanguage) {
      console.log('[PAGE] returning user + language set → /commute')
      router.replace('/commute')
    } else if (user && profileComplete && !profile!.uiLanguage) {
      console.log('[PAGE] returning user + no language → /onboarding/language')
      router.replace('/onboarding/language')
    } else if (user && !profileComplete) {
      console.log('[PAGE] new user or incomplete profile → /onboarding')
      router.replace('/onboarding')
    } else {
      console.log('[PAGE] no session → showing login page')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#f2efe9' }}>
        <div className="text-center">
          <div className="font-serif text-3xl mb-2" style={{ color: '#8a6530' }}>KoraTrade</div>
          <div className="text-sm" style={{ color: '#9c8c6e' }}>Loading...</div>
        </div>
      </div>
    )
  }

  // Redirecting — don't flash the login page
  if (user && profile && profile.name?.trim()) return null

  return <LoginPage />
}

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
    if (user && profile) {
      console.log('[PAGE] stored session + profile found → redirecting to /commute')
      router.replace('/commute')
    } else if (user && !profile) {
      console.log('[PAGE] stored session but NO profile → showing login page (user must log in explicitly)')
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

  // Fully onboarded user — redirecting to /commute, don't flash the login page
  if (user && profile) return null

  return <LoginPage />
}

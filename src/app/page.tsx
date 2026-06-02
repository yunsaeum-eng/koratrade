'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  // Handles the "app restore" case: user returns with a stored Supabase session.
  // LoginPage handles routing after a fresh sign-in / sign-up.
  useEffect(() => {
    if (loading) return
    if (user && profile) router.replace('/commute')
    else if (user && !profile) router.replace('/onboarding')
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

  // User is logged in — useEffect above is redirecting, don't flash LoginPage
  if (user) return null

  return <LoginPage />
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  const { user, profile, loading, profileLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading || profileLoading) return
    if (user && profile) {
      router.replace('/commute')
    } else if (user && !profile) {
      router.replace('/onboarding')
    }
  }, [user, profile, loading, profileLoading, router])

  if (loading || profileLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#f2efe9' }}>
        <div className="text-center">
          <div className="font-serif text-3xl mb-2" style={{ color: '#8a6530' }}>KoraTrade</div>
          <div className="text-sm" style={{ color: '#9c8c6e' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (user) return null  // redirecting, don't flash LoginPage

  return <LoginPage />
}

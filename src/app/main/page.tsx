'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { GameProvider } from '@/contexts/GameContext'
import MainLayout from '@/components/chat/MainLayout'

export default function MainPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.replace('/')
  }, [user, router])

  if (!user) return null

  return (
    <GameProvider uid={user.uid}>
      <MainLayout />
    </GameProvider>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { GameProvider } from '@/contexts/GameContext'
import PlayScreen from '@/components/episodes/PlayScreen'

export default function PlayPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const episodeId = params?.episodeId as string ?? 'ep01'

  useEffect(() => {
    if (!user) router.replace('/')
  }, [user, router])

  if (!user) return null

  return (
    <GameProvider uid={user.uid}>
      <PlayScreen episodeId={episodeId} />
    </GameProvider>
  )
}

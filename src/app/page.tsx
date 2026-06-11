'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  const { loading } = useAuth()

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

  return <LoginPage />
}

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserProfile } from '@/types'

interface LocalUser {
  uid: string
  email: string
}

interface AuthContextType {
  user: LocalUser | null
  profile: UserProfile | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setProfile: (profile: UserProfile) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function hashish(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h.toString(36)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('kt_session')
    if (stored) {
      const u: LocalUser = JSON.parse(stored)
      setUser(u)
      const p = localStorage.getItem(`kt_profile_${u.uid}`)
      if (p) setProfileState(JSON.parse(p))
    }
    setLoading(false)
  }, [])

  const setProfile = (p: UserProfile) => {
    setProfileState(p)
    if (user) localStorage.setItem(`kt_profile_${user.uid}`, JSON.stringify(p))
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const uid = hashish(email + password + Date.now())
    const accounts: Record<string, string> = JSON.parse(localStorage.getItem('kt_accounts') || '{}')
    if (accounts[email]) throw new Error('이미 가입된 이메일입니다.')
    accounts[email] = hashish(password)
    localStorage.setItem('kt_accounts', JSON.stringify(accounts))
    localStorage.setItem('kt_uid_map', JSON.stringify({
      ...JSON.parse(localStorage.getItem('kt_uid_map') || '{}'),
      [email]: uid,
    }))
    const u = { uid, email }
    localStorage.setItem('kt_session', JSON.stringify(u))
    setUser(u)
  }

  const signInWithEmail = async (email: string, password: string) => {
    const accounts: Record<string, string> = JSON.parse(localStorage.getItem('kt_accounts') || '{}')
    if (!accounts[email] || accounts[email] !== hashish(password)) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
    const uidMap: Record<string, string> = JSON.parse(localStorage.getItem('kt_uid_map') || '{}')
    const uid = uidMap[email]
    const u = { uid, email }
    localStorage.setItem('kt_session', JSON.stringify(u))
    setUser(u)
    const p = localStorage.getItem(`kt_profile_${uid}`)
    if (p) setProfileState(JSON.parse(p))
  }

  const logout = async () => {
    localStorage.removeItem('kt_session')
    setUser(null)
    setProfileState(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithEmail, signUpWithEmail, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

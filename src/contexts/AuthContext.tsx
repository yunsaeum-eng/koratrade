'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserProfile } from '@/types'
import { supabase } from '@/lib/supabase'
import { loadProfile, saveProfile } from '@/services/gameData'

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Only used to resolve the initial loading state — does NOT restore session.
    // Refreshing always shows the login page.
    supabase.auth.getSession().then(() => {
      if (mounted) setLoading(false)
    }).catch(() => {
      if (mounted) setLoading(false)
    })

    // Only handle sign-out after initial load.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null)
          setProfileState(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const setProfile = (p: UserProfile) => {
    setProfileState(p)
    saveProfile(p).catch(console.error)
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const u = { uid: session.user.id, email: session.user.email! }
      setUser(u)
      const p = await loadProfile(session.user.id).catch(() => null)
      setProfileState(p)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
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

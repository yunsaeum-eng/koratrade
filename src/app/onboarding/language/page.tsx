'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LanguageSelectPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/commute') }, [router])
  return null
}

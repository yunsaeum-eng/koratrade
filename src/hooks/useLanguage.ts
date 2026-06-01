'use client'

import { useState, useCallback } from 'react'
import { Lang } from '@/types'

const VALID: Lang[] = ['ko', 'en']

function storedLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const raw = localStorage.getItem('kt_lang')
  if (raw && VALID.includes(raw as Lang)) return raw as Lang
  // clear stale value (e.g. old 'mixed') and fall back to default
  localStorage.removeItem('kt_lang')
  return 'en'
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(storedLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('kt_lang', l)
  }, [])

  return { lang, setLang }
}

'use client'

import { useState, useCallback } from 'react'
import { Lang } from '@/types'
import { UILang, TranslationKey, tr } from '@/data/translations'

const VALID: Lang[] = ['ko', 'en']

function storedLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const raw = localStorage.getItem('kt_lang')
  if (raw && VALID.includes(raw as Lang)) return raw as Lang
  localStorage.removeItem('kt_lang')
  return 'en'
}

function storedUiLang(): UILang {
  if (typeof window === 'undefined') return 'korean'
  const raw = localStorage.getItem('kt_ui_lang')
  if (raw === 'korean' || raw === 'english') return raw
  return 'korean'
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(storedLang)
  const [uiLang, setUiLangState] = useState<UILang>(storedUiLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('kt_lang', l)
    const ui: UILang = l === 'en' ? 'english' : 'korean'
    setUiLangState(ui)
    localStorage.setItem('kt_ui_lang', ui)
  }, [])

  const setUiLang = useCallback((ui: UILang) => {
    setUiLangState(ui)
    localStorage.setItem('kt_ui_lang', ui)
    const l: Lang = ui === 'english' ? 'en' : 'ko'
    setLangState(l)
    localStorage.setItem('kt_lang', l)
  }, [])

  const t = useCallback((key: TranslationKey) => tr(key, uiLang), [uiLang])

  return { lang, setLang, uiLang, setUiLang, t }
}

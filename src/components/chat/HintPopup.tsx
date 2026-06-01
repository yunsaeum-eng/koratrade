'use client'

import { useEffect, useRef } from 'react'
import { Lang } from '@/types'
import { Hint, HINT_POPUP_LABEL, t } from '@/data/dialogues'

interface Props {
  hints: Hint[]
  lang: Lang
  onClose: () => void
}

export default function HintPopup({ hints, lang, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute bottom-16 left-4 right-4 rounded-2xl shadow-lg border overflow-hidden z-20"
      style={{ background: 'white', borderColor: '#e0d8cc' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: '#e0d8cc', background: '#faf5ec' }}>
        <span className="text-xs font-semibold" style={{ color: '#8a6530' }}>
          {t(HINT_POPUP_LABEL, lang)}
        </span>
        <button
          onClick={onClose}
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-gray-200"
          style={{ color: '#9c8c6e' }}
        >
          ✕
        </button>
      </div>

      {/* Hint items */}
      <div className="divide-y" style={{ borderColor: '#f2efe9' }}>
        {hints.map((hint, i) => (
          <div key={i} className="px-4 py-3">
            <div className="text-xs mb-0.5 px-1.5 py-0.5 rounded inline-block" style={{ background: '#f2efe9', color: '#9c8c6e' }}>
              {hint.context}
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: '#1a1208' }}>{hint.english}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b5c3e' }}>{hint.korean}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-xs" style={{ background: '#faf8f4', color: '#9c8c6e' }}>
        {lang === 'ko' ? '참고용이에요. 자유롭게 직접 입력하세요.' : 'reference only — type your own response freely.'}
      </div>
    </div>
  )
}

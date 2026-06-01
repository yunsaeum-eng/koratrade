'use client'

import { Lang } from '@/types'

const OPTIONS: { value: Lang; label: string; title: string }[] = [
  { value: 'ko', label: '한국어', title: '한국어 모드' },
  { value: 'en', label: 'English', title: 'English mode' },
]

interface Props {
  lang: Lang
  onChange: (l: Lang) => void
}

export default function LanguageSwitcher({ lang, onChange }: Props) {
  return (
    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#e0d8cc' }}>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          title={opt.title}
          onClick={() => onChange(opt.value)}
          className="px-2.5 py-1 text-xs font-medium transition-all"
          style={
            lang === opt.value
              ? { background: '#8a6530', color: 'white' }
              : { background: 'transparent', color: '#9c8c6e' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

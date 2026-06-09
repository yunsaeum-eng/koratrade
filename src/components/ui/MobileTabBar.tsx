'use client'

import { AppView } from '@/types'
import { useLanguage } from '@/hooks/useLanguage'
import { TranslationKey } from '@/data/translations'

const TABS: { key: AppView; icon: string; tKey: TranslationKey }[] = [
  { key: 'chat',     icon: '💬', tKey: 'chat' },
  { key: 'notes',    icon: '📚', tKey: 'notes' },
  { key: 'profiles', icon: '👥', tKey: 'people' },
  { key: 'progress', icon: '🗺️', tKey: 'progress' },
]

interface Props {
  view: AppView
  onChange: (v: AppView) => void
}

export default function MobileTabBar({ view, onChange }: Props) {
  const { t } = useLanguage()
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 flex items-stretch border-t bg-white z-40"
      style={{ height: 60, borderColor: '#e0d8cc', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
          style={{ color: view === tab.key ? '#8a6530' : '#9c8c6e' }}
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span className="text-xs font-medium">{t(tab.tKey)}</span>
        </button>
      ))}
    </div>
  )
}

'use client'

import { AppView } from '@/types'

const TABS: { key: AppView; icon: string; label: string }[] = [
  { key: 'chat',     icon: '💬', label: '채팅' },
  { key: 'notes',    icon: '📚', label: '노트' },
  { key: 'profiles', icon: '👥', label: '인물' },
  { key: 'progress', icon: '🗺️', label: '진행' },
]

interface Props {
  view: AppView
  onChange: (v: AppView) => void
}

export default function MobileTabBar({ view, onChange }: Props) {
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
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

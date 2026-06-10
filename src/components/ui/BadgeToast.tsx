'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/types'
import { useLanguage } from '@/hooks/useLanguage'

interface Props {
  badge: Badge
  onDone: () => void
}

export default function BadgeToast({ badge, onDone }: Props) {
  const { isEn } = useLanguage()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const out = setTimeout(() => setLeaving(true), 3200)
    const done = setTimeout(onDone, 3600)
    return () => { clearTimeout(out); clearTimeout(done) }
  }, [onDone])

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${leaving ? 'badge-out' : 'badge-in'}`}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border"
        style={{ background: 'white', borderColor: '#e0d8cc', minWidth: '240px' }}
      >
        <div className="text-3xl">{badge.emoji}</div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#8a6530' }}>
            {isEn ? 'Badge Unlocked!' : '배지 획득!'}
          </div>
          <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>
            {isEn ? (badge.nameEn ?? badge.name) : badge.name}
          </div>
          <div className="text-xs" style={{ color: '#9c8c6e' }}>
            {isEn ? (badge.descriptionEn ?? badge.description) : badge.description}
          </div>
        </div>
        <div className="ml-auto w-1 self-stretch rounded-full" style={{ background: '#8a6530' }} />
      </div>
    </div>
  )
}

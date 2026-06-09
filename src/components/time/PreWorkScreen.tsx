'use client'

import { formatCountdown } from '@/hooks/useTimePhase'
import { useLanguage } from '@/hooks/useLanguage'

interface Props {
  secondsUntil9: number
  dateStr: string
  onSkip: () => void
}

export default function PreWorkScreen({ secondsUntil9, dateStr, onSkip }: Props) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <div className="font-serif text-2xl mb-2" style={{ color: '#8a6530' }}>KoraTrade Inc.</div>
      <div className="text-xs mb-8" style={{ color: '#9c8c6e' }}>{dateStr}</div>

      <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6" style={{ background: '#f2efe9' }}>
        🌅
      </div>

      <div className="font-semibold mb-1" style={{ color: '#1a1208' }}>{t('beforeWork')}</div>
      <div className="text-sm mb-6" style={{ color: '#9c8c6e' }}>{t('workHoursInfo')}</div>

      <div className="rounded-2xl px-8 py-4 mb-8 border" style={{ background: '#faf8f4', borderColor: '#e0d8cc' }}>
        <div className="text-xs mb-1" style={{ color: '#9c8c6e' }}>{t('untilWork')}</div>
        <div className="font-mono text-4xl font-light" style={{ color: '#1a1208' }}>{formatCountdown(secondsUntil9)}</div>
      </div>

      <div className="text-xs mb-4" style={{ color: '#9c8c6e' }}>오늘의 미션: S1·EP01 — First Day Jitters</div>

      <button
        onClick={onSkip}
        className="text-xs px-4 py-2 rounded-xl border transition-colors hover:bg-gray-50"
        style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}
      >
        {t('earlyEntry')}
      </button>
    </div>
  )
}

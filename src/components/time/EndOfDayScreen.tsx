'use client'

import { useLanguage } from '@/hooks/useLanguage'

interface Props {
  xpTotal: number
  learnedCount: number
  level: number
  onDismiss: () => void
}

export default function EndOfDayScreen({ xpTotal, learnedCount, level, onDismiss }: Props) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,18,8,0.5)' }}>
      <div className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'white' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center" style={{ background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8e0 100%)' }}>
          <div className="text-4xl mb-2">🌇</div>
          <div className="font-semibold" style={{ color: '#1a1208' }}>{t('endOfDay')}</div>
          <div className="text-sm mt-1" style={{ color: '#9c8c6e' }}>{t('wellDone')}</div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#e0d8cc' }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9c8c6e' }}>{t('dailySummary')}</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl py-3" style={{ background: '#faf5ec' }}>
              <div className="font-mono font-semibold" style={{ color: '#8a6530' }}>{xpTotal}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>{t('totalXp')}</div>
            </div>
            <div className="rounded-xl py-3" style={{ background: '#faf5ec' }}>
              <div className="font-mono font-semibold" style={{ color: '#8a6530' }}>{learnedCount}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>{t('expressionsLearned')}</div>
            </div>
            <div className="rounded-xl py-3" style={{ background: '#faf5ec' }}>
              <div className="font-mono font-semibold" style={{ color: '#8a6530' }}>Lv.{level}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>{t('level')}</div>
            </div>
          </div>
        </div>

        {/* Tomorrow teaser */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#e0d8cc' }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9c8c6e' }}>{t('tomorrowPreview')}</div>
          <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
            Sarah 팀장이 첫 번째 과제를 내려보낸다. Sophie Beaumont에게 보낼 콜드 이메일 마감은 내일 오전 10시.
            James가 조용히 귀띔한다 — <span style={{ color: '#8a6530' }}>"소피는 까다롭지만 방법이 있어요."</span>
          </p>
        </div>

        {/* Dismiss */}
        <div className="px-6 py-4">
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#8a6530' }}
          >
            {t('continueUsing')}
          </button>
          <p className="text-center text-xs mt-2" style={{ color: '#9c8c6e' }}>{t('allFeaturesAvailable')}</p>
        </div>
      </div>
    </div>
  )
}

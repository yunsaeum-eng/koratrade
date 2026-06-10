'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

interface Props {
  tip: string
  onDone: () => void
}

export default function EtiquetteToast({ tip, onDone }: Props) {
  const { isEn } = useLanguage()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const out = setTimeout(() => setLeaving(true), 5000)
    const done = setTimeout(onDone, 5400)
    return () => { clearTimeout(out); clearTimeout(done) }
  }, [onDone])

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${leaving ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl border max-w-sm"
        style={{ background: 'white', borderColor: '#c8b88a' }}
      >
        <span className="text-lg flex-shrink-0">💼</span>
        <div className="flex-1">
          <div className="text-xs font-semibold mb-0.5" style={{ color: '#8a6530' }}>
            {isEn ? 'Workplace Etiquette Tip' : '직장 에티켓 팁'}
          </div>
          <div className="text-xs leading-relaxed" style={{ color: '#1a1208' }}>{tip}</div>
        </div>
        <button onClick={() => { setLeaving(true); setTimeout(onDone, 300) }} className="text-xs flex-shrink-0" style={{ color: '#9c8c6e' }}>✕</button>
      </div>
    </div>
  )
}

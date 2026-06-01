'use client'

import { PHASE_DEFS } from '@/data/curriculum'
import { clockToStr } from '@/hooks/useGameClock'

interface PhaseIndicatorProps {
  currentPhase: number
  episodeTitle: string
  progress: number
  gameClockMinutes: number
}

// Cumulative game-clock start times for each phase (starting at 09:00 = 540 min)
const PHASE_START_MINUTES = [540, 600, 720, 870, 960]

export default function PhaseIndicator({
  currentPhase,
  episodeTitle,
  progress,
  gameClockMinutes,
}: PhaseIndicatorProps) {
  const activePhase = PHASE_DEFS.find(p => p.id === currentPhase)
  const phaseStartMin = PHASE_START_MINUTES[currentPhase - 1] ?? 540
  const phaseEndMin = phaseStartMin + (activePhase?.clockAdvance ?? 0)

  return (
    <div className="bg-white rounded-xl border p-3" style={{ borderColor: '#e0d8cc' }}>
      {/* Episode label */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold" style={{ color: '#8a6530' }}>{episodeTitle}</div>
        <div className="text-xs" style={{ color: '#9c8c6e' }}>{progress}%</div>
      </div>

      {/* Phase dots row */}
      <div className="flex items-center gap-1.5 mb-2.5">
        {PHASE_DEFS.map(phase => {
          const isCompleted = phase.id < currentPhase
          const isActive = phase.id === currentPhase
          const isFuture = phase.id > currentPhase

          return (
            <div key={phase.id} className="flex-1 flex flex-col items-center gap-1">
              {/* Dot / pill */}
              <div
                className="w-full h-2 rounded-full transition-all"
                style={{
                  background: isCompleted
                    ? '#256040'
                    : isActive
                    ? '#8a6530'
                    : isFuture
                    ? '#e0d8cc'
                    : '#e0d8cc',
                }}
              />
              {/* Phase number */}
              <span
                className="text-[9px] font-semibold tabular-nums"
                style={{
                  color: isCompleted
                    ? '#256040'
                    : isActive
                    ? '#8a6530'
                    : '#c4b89a',
                }}
              >
                {phase.id}
              </span>
            </div>
          )
        })}
      </div>

      {/* Active phase info */}
      {activePhase && (
        <div
          className="rounded-lg px-2.5 py-2 flex items-start gap-2"
          style={{ background: '#fdf8f0' }}
        >
          {/* Clock icon */}
          <span className="text-sm mt-0.5" aria-hidden="true">🕐</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold truncate" style={{ color: '#8a6530' }}>
                {activePhase.nameKr}
              </span>
              <span
                className="text-[10px] font-mono shrink-0"
                style={{ color: '#9c8c6e' }}
              >
                {clockToStr(phaseStartMin)}–{clockToStr(phaseEndMin)}
              </span>
            </div>
            <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#6b5c3e' }}>
              {activePhase.name} · {activePhase.duration}
            </div>
          </div>
        </div>
      )}

      {/* Overall progress bar */}
      <div className="mt-2.5 h-1 rounded-full" style={{ background: '#e0d8cc' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ background: '#8a6530', width: `${progress}%` }}
        />
      </div>

      {/* Current game clock */}
      <div className="mt-1.5 text-[10px] text-right" style={{ color: '#9c8c6e' }}>
        현재 {clockToStr(gameClockMinutes)}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useAuth } from '@/contexts/AuthContext'
import { CURRICULUM, EPISODE_EMOJI, SEASON_OVERVIEWS, getCheckedObjectives } from '@/data/curriculum'

// ─── Radar / skill chart ──────────────────────────────────────────────────────

const SKILLS = [
  { id: 'email',       label: '이메일 작성',      relatedEps: ['ep05', 'ep07'] },
  { id: 'meeting',     label: '미팅 영어',         relatedEps: ['ep04', 'ep06', 'ep07'] },
  { id: 'negotiation', label: '협상 표현',         relatedEps: [] },         // S4+
  { id: 'trade',       label: '무역 실무',         relatedEps: [] },         // S2+
  { id: 'workplace',   label: '직장 커뮤니케이션', relatedEps: ['ep01', 'ep02', 'ep03', 'ep06'] },
  { id: 'culture',     label: '비즈니스 문화',     relatedEps: ['ep01', 'ep02', 'ep04'] },
]

function RadarChart({ completedIds }: { completedIds: string[] }) {
  const cx = 120, cy = 120, r = 85
  const n = SKILLS.length

  // Compute skill values 0–1
  const values = SKILLS.map(skill => {
    if (skill.relatedEps.length === 0) return 0.08  // tiny base for locked skills
    const done = skill.relatedEps.filter(id => completedIds.includes(id)).length
    return Math.max(0.08, done / skill.relatedEps.length)
  })

  const angleOf = (i: number) => ((i / n) * 2 * Math.PI) - Math.PI / 2

  const pt = (i: number, v: number) => ({
    x: cx + r * v * Math.cos(angleOf(i)),
    y: cy + r * v * Math.sin(angleOf(i)),
  })

  // Grid hexagons at 25/50/75/100%
  const gridLevels = [0.25, 0.5, 0.75, 1]
  const gridPaths = gridLevels.map(lv =>
    Array.from({ length: n }, (_, i) => {
      const { x, y } = pt(i, lv)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ') + ' Z'
  )

  // Data polygon
  const dataPath = values.map((v, i) => {
    const { x, y } = pt(i, v)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#e0d8cc" strokeWidth={0.8} />
      ))}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const end = pt(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)} stroke="#e0d8cc" strokeWidth={0.8} />
      })}
      {/* Data fill */}
      <path d={dataPath} fill="rgba(138,101,48,0.15)" stroke="#8a6530" strokeWidth={1.5} />
      {/* Data dots */}
      {values.map((v, i) => {
        const { x, y } = pt(i, v)
        return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={3} fill="#8a6530" />
      })}
      {/* Labels */}
      {SKILLS.map((sk, i) => {
        const { x, y } = pt(i, 1.28)
        const anchor = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end'
        return (
          <text key={i} x={x.toFixed(1)} y={y.toFixed(1)} textAnchor={anchor}
            fontSize="8.5" fill="#6b5c3e" fontFamily="Pretendard, sans-serif">
            {sk.label}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Episode card ─────────────────────────────────────────────────────────────

function EpisodeCard({
  ep, status, isCurrent, progress, completedDate,
}: {
  ep: typeof CURRICULUM[0]
  status: 'completed' | 'active' | 'locked'
  isCurrent: boolean
  progress: number
  completedDate?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const emoji = EPISODE_EMOJI[ep.id] ?? '📋'
  const checkedCount = getCheckedObjectives(progress, (ep.objectives ?? []).length)

  const borderColor = status === 'completed' ? '#256040' : isCurrent ? '#8a6530' : '#e0d8cc'
  const bg = status === 'completed' ? '#f0faf4' : isCurrent ? '#faf5ec' : '#fafafa'

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor, background: bg, opacity: status === 'locked' ? 0.55 : 1 }}>
      {/* Header row */}
      <button onClick={() => status !== 'locked' && setExpanded(e => !e)} className="w-full text-left px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: status === 'locked' ? '#f0f0f0' : '#f2efe9' }}>
          {status === 'locked' ? '🔒' : emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-semibold" style={{ color: '#8a6530' }}>EP{String(ep.episode).padStart(2, '0')}</span>
            <span className="text-sm font-semibold truncate" style={{ color: status === 'locked' ? '#aaa' : '#1a1208' }}>
              {status === 'locked' ? '???' : ep.titleKr}
            </span>
            {isCurrent && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 animate-pulse" style={{ background: '#8a6530', color: 'white' }}>진행중</span>
            )}
            {status === 'completed' && (
              <span className="text-xs flex-shrink-0">✅</span>
            )}
          </div>
          {status !== 'locked' && (
            <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: '#9c8c6e' }}>
              <span>핵심 표현 {ep.expressions.length}개</span>
              {ep.estimatedMinutes && <span>약 {ep.estimatedMinutes}분</span>}
              {status === 'active' && progress > 0 && <span>{progress}% 완료</span>}
              {completedDate && <span>{completedDate}</span>}
            </div>
          )}
        </div>

        {status !== 'locked' && <span className="text-xs" style={{ color: '#9c8c6e' }}>{expanded ? '▲' : '▼'}</span>}
      </button>

      {/* Progress bar for active */}
      {isCurrent && progress > 0 && (
        <div className="px-4 pb-2">
          <div className="h-1.5 rounded-full" style={{ background: '#e0d8cc' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#8a6530' }} />
          </div>
        </div>
      )}

      {/* Expanded objectives + expressions */}
      {expanded && status !== 'locked' && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: '#e0d8cc' }}>
          {/* Objectives */}
          {(ep.objectives ?? []).length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#9c8c6e' }}>학습 목표</div>
              <div className="space-y-1">
                {(ep.objectives ?? []).map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="flex-shrink-0 mt-0.5">{i < checkedCount ? '✅' : '☐'}</span>
                    <span style={{ color: i < checkedCount ? '#256040' : '#1a1208' }}>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expressions */}
          <div className="mt-3">
            <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#9c8c6e' }}>핵심 표현</div>
            <div className="space-y-1">
              {ep.expressions.map(expr => (
                <div key={expr.id} className="flex items-start gap-2 text-xs p-2 rounded-lg" style={{ background: '#f2efe9' }}>
                  <span className="flex-shrink-0 mt-0.5">{expr.learned ? '✅' : '📖'}</span>
                  <div>
                    <div className="font-medium" style={{ color: '#1a1208' }}>{expr.english}</div>
                    <div style={{ color: '#6b5c3e' }}>{expr.korean}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SeasonMap() {
  const { state } = useGame()
  const { profile } = useAuth()
  const [activeSeason, setActiveSeason] = useState(1)
  const { completedEpisodeIds, currentEpisodeId, currentSeason, xp, level } = state

  const s1eps = CURRICULUM.filter(ep => ep.season === 1)
  const completedS1 = completedEpisodeIds.filter(id => s1eps.some(e => e.id === id)).length
  const totalExpressions = s1eps.reduce((sum, ep) => sum + ep.expressions.filter(e => e.learned).length, 0)
  const streak = typeof window !== 'undefined' ? parseInt(localStorage.getItem('kt_streak') || '0') : 0
  const totalBadges = state.badges.length

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'white' }}>
      <div className="px-5 py-3 border-b flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
        <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>Learning Progress</div>
        <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>나의 학습 여정</div>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Overview stats ── */}
        <div className="px-5 py-4 border-b" style={{ borderColor: '#e0d8cc' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9c8c6e' }}>전체 진행도</span>
            <span className="text-xs font-mono" style={{ color: '#8a6530' }}>{completedS1} / 46 에피소드</span>
          </div>
          <div className="h-2 rounded-full mb-4" style={{ background: '#e0d8cc' }}>
            <div className="h-full rounded-full" style={{ width: `${(completedS1 / 46) * 100}%`, background: '#8a6530' }} />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '완료 에피소드', value: completedS1, icon: '✅' },
              { label: '습득 표현', value: totalExpressions, icon: '📖' },
              { label: '연속 학습일', value: streak, icon: '🔥' },
              { label: '획득 뱃지', value: totalBadges, icon: '🏅' },
            ].map(stat => (
              <div key={stat.label} className="text-center py-2.5 rounded-xl border" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
                <div className="text-lg">{stat.icon}</div>
                <div className="font-mono font-semibold text-sm" style={{ color: '#8a6530' }}>{stat.value}</div>
                <div className="text-xs leading-tight" style={{ color: '#9c8c6e', fontSize: '10px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-3" style={{ background: '#faf5ec', border: '1px solid #e8d8b8' }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: '#8a6530' }}>Lv.{level} · {profile?.title ?? 'Intern'}</div>
              <div className="text-xs" style={{ color: '#9c8c6e' }}>{xp} XP · 다음 레벨까지 {200 - (xp % 200)} XP</div>
            </div>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e0d8cc' }}>
              <div className="h-full rounded-full" style={{ width: `${(xp % 200) / 200 * 100}%`, background: '#8a6530' }} />
            </div>
          </div>
        </div>

        {/* ── Season tabs ── */}
        <div className="flex border-b overflow-x-auto" style={{ borderColor: '#e0d8cc' }}>
          {SEASON_OVERVIEWS.map(s => {
            const locked = s.season > currentSeason && s.season > 1
            return (
              <button
                key={s.season}
                onClick={() => setActiveSeason(s.season)}
                className="flex-shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all"
                style={{
                  borderColor: activeSeason === s.season ? '#8a6530' : 'transparent',
                  color: activeSeason === s.season ? '#8a6530' : locked ? '#bbb' : '#9c8c6e',
                }}
              >
                {locked ? '🔒 ' : ''}S{s.season}
              </button>
            )
          })}
        </div>

        {/* ── Active season content ── */}
        {SEASON_OVERVIEWS.filter(s => s.season === activeSeason).map(season => {
          const locked = season.season > currentSeason && season.season > 1
          const seasonEps = CURRICULUM.filter(ep => ep.season === season.season)
          const seasonDone = completedEpisodeIds.filter(id => seasonEps.some(e => e.id === id)).length

          return (
            <div key={season.season} className="px-5 py-4 space-y-4">
              {/* Season header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-semibold" style={{ color: '#1a1208' }}>
                      Season {season.season} — {season.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>{season.subtitle}</div>
                  </div>
                  <div className="text-2xl flex-shrink-0">{season.badge.emoji}</div>
                </div>

                <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b5c3e' }}>
                  {season.objective}
                </p>

                {!locked && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e0d8cc' }}>
                      <div className="h-full rounded-full" style={{ width: `${(seasonDone / season.episodeCount) * 100}%`, background: '#256040' }} />
                    </div>
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: '#256040' }}>{seasonDone}/{season.episodeCount}</span>
                  </div>
                )}
              </div>

              {/* Episode list */}
              {locked ? (
                <div className="space-y-2">
                  {(season.previewEpisodes ?? []).map((title, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#e0d8cc', background: '#fafafa', opacity: 0.6 }}>
                      <span className="text-sm">🔒</span>
                      <span className="text-xs" style={{ color: '#aaa' }}>EP{String(i + 1).padStart(2, '0')} — {title}</span>
                    </div>
                  ))}
                  <div className="text-center text-xs py-2" style={{ color: '#9c8c6e' }}>
                    S{season.season - 1} 완료 후 해금
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {seasonEps.map(ep => {
                    const isCompleted = completedEpisodeIds.includes(ep.id)
                    const isCurrent = ep.id === currentEpisodeId
                    const prevDone = !ep.unlockRequiresEpisode || completedEpisodeIds.includes(ep.unlockRequiresEpisode)
                    const status = isCompleted ? 'completed' : (!prevDone ? 'locked' : 'active')
                    return (
                      <EpisodeCard
                        key={ep.id}
                        ep={ep}
                        status={status}
                        isCurrent={isCurrent}
                        progress={isCurrent ? state.currentEpisode.progress : (isCompleted ? 100 : 0)}
                        completedDate={isCompleted ? '완료' : undefined}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* ── Skill radar ── */}
        <div className="px-5 py-4 border-t" style={{ borderColor: '#e0d8cc' }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9c8c6e' }}>스킬 레이더</div>
          <RadarChart completedIds={completedEpisodeIds} />
          <p className="text-xs text-center mt-2" style={{ color: '#9c8c6e' }}>에피소드를 완료할수록 스킬이 채워집니다</p>
        </div>

      </div>
    </div>
  )
}

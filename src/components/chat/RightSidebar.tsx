'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { getCurriculumEpisode, PHASE_DEFS } from '@/data/curriculum'
import { getMissionsForEpisode, getMissionsForPhase } from '@/data/missions'

export default function RightSidebar() {
  const { state, dispatch } = useGame()
  const { currentEpisode, currentPhase, expressionEncounters } = state
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null)

  const learnedCount = currentEpisode.expressions.filter(e => e.learned).length
  const progressPct = currentEpisode.progress
  const [objectivesOpen, setObjectivesOpen] = useState(true)

  const currEp = getCurriculumEpisode(state.currentEpisodeId)
  const objectives = currEp?.objectives ?? []

  // Mission data for current episode
  const allEpisodeMissions = getMissionsForEpisode(state.currentEpisodeId)
  const completedCount = allEpisodeMissions.filter(m => state.completedMissionIds.includes(m.id)).length
  const totalMissions = allEpisodeMissions.length
  const missionProgressPct = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0

  // Objectives check ONLY when missions are completed — never auto-check from progress
  const completedForEp = completedCount
  const checkedCount = objectives.length > 0 && totalMissions > 0
    ? Math.floor((completedForEp / totalMissions) * objectives.length)
    : 0
  const allDone = objectives.length > 0 && checkedCount >= objectives.length

  // Current phase label
  const phaseDef = PHASE_DEFS[currentPhase - 1]
  const currentPhaseMissions = getMissionsForPhase(state.currentEpisodeId, currentPhase)

  const getMissionStatus = (missionId: string, missionPhase: number): 'completed' | 'active' | 'locked' => {
    if (state.completedMissionIds.includes(missionId)) return 'completed'
    if (missionPhase === currentPhase) return 'active'
    if (missionPhase < currentPhase) return 'active'  // past phases still playable, not auto-complete
    return 'locked'
  }

  const handleLearnExpression = (id: string, xp: number, alreadyLearned: boolean) => {
    dispatch({ type: 'LEARN_EXPRESSION', expressionId: id })
    dispatch({ type: 'RECORD_EXPRESSION_ENCOUNTER', expressionId: id })
    if (!alreadyLearned) {
      dispatch({ type: 'ADD_GAME_MINUTES', amount: 12 })
      dispatch({ type: 'ADD_XP', amount: xp })
      dispatch({ type: 'ADVANCE_EPISODE_PROGRESS', amount: 10 })
      dispatch({ type: 'EARN_BADGE', badge: { id: 'first_expression', emoji: '📖', name: '표현 습득', nameEn: 'Expression Learned', description: '첫 비즈니스 표현을 학습했습니다' } })
      const ep = currentEpisode.expressions.find(e => e.id === id)
      if (ep) {
        dispatch({
          type: 'ADD_WORK_NOTE',
          note: {
            id: `expr-${id}`,
            type: 'expression',
            content: ep.english,
            translation: ep.korean,
            tag: ep.context,
            addedAt: new Date().toISOString(),
            source: 'auto',
          },
        })
      }
      const newProgress = Math.min(100, currentEpisode.progress + 10)
      if (newProgress >= 100) {
        dispatch({ type: 'EARN_BADGE', badge: { id: 'episode_1', emoji: '⭐', name: '에피소드 완료', nameEn: 'Episode Complete', description: 'EP01 첫 출근을 완료했습니다' } })
      }
    }
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto text-sm p-3 gap-4">

      {/* 🎯 오늘의 학습 목표 */}
      {objectives.length > 0 && (
        <div>
          <button
            onClick={() => setObjectivesOpen(o => !o)}
            className="w-full flex items-center justify-between mb-1.5"
          >
            <div className="flex items-center gap-1.5">
              <span>🎯</span>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: allDone ? '#256040' : '#9c8c6e' }}>
                오늘의 학습 목표
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {allDone
                ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f0faf4', color: '#256040' }}>목표 달성! ✓</span>
                : <span className="text-xs" style={{ color: '#9c8c6e' }}>{checkedCount}/{objectives.length}</span>
              }
              <span className="text-xs" style={{ color: '#9c8c6e' }}>{objectivesOpen ? '▲' : '▼'}</span>
            </div>
          </button>

          {objectivesOpen && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: allDone ? '#b8e0c8' : '#e0d8cc', background: allDone ? '#f0faf4' : 'white' }}>
              {objectives.map((obj, idx) => {
                const checked = idx < checkedCount
                return (
                  <div key={idx} className="flex items-start gap-2 px-3 py-2 border-b last:border-0" style={{ borderColor: '#f2efe9' }}>
                    <span className="text-sm flex-shrink-0 mt-0.5">{checked ? '✅' : '☐'}</span>
                    <span className="text-xs leading-relaxed" style={{ color: checked ? '#256040' : '#1a1208', textDecoration: checked ? 'none' : 'none' }}>
                      {obj}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Autonomous mission tracker */}
      <div>
        {/* Phase header */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#9c8c6e' }}>오늘의 미션</div>
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#fdf8f0', color: '#8a6530' }}>
            Phase {currentPhase}/5
          </span>
        </div>

        {/* Phase name */}
        <div className="mb-2 px-2.5 py-1.5 rounded-lg" style={{ background: '#f2efe9' }}>
          <div className="text-xs font-semibold" style={{ color: '#1a1208' }}>{phaseDef?.nameKr ?? ''}</div>
          <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>{phaseDef?.description ?? ''}</div>
        </div>

        {/* Overall episode mission progress */}
        {totalMissions > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: '#9c8c6e' }}>에피소드 미션</span>
              <span className="text-xs font-semibold" style={{ color: completedCount === totalMissions ? '#256040' : '#8a6530' }}>
                {completedCount}/{totalMissions}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e0d8cc' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${missionProgressPct}%`, background: missionProgressPct === 100 ? '#256040' : '#8a6530' }}
              />
            </div>
          </div>
        )}

        {/* Current phase missions */}
        {currentPhaseMissions.length > 0 ? (
          <div className="space-y-1.5">
            {currentPhaseMissions.map(mission => {
              const status = getMissionStatus(mission.id, mission.phase)
              const isExpanded = expandedMissionId === mission.id
              return (
                <div key={mission.id}>
                  <button
                    onClick={() => setExpandedMissionId(isExpanded ? null : mission.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all"
                    style={{
                      borderColor: status === 'completed' ? '#b8e0c8' : '#e0d8cc',
                      background: status === 'completed' ? '#f0faf4' : 'white',
                    }}
                  >
                    <span className="text-base flex-shrink-0">
                      {status === 'completed' ? '✅' : status === 'active' ? '⏳' : '🔒'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium leading-tight" style={{
                        color: status === 'completed' ? '#256040' : '#1a1208',
                      }}>
                        {mission.nameKr}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>+{mission.xp} XP</div>
                    </div>
                  </button>
                  {/* Mission detail / undo */}
                  {isExpanded && (
                    <div className="mx-2 mb-1 px-3 py-2 rounded-b-xl border border-t-0 text-xs" style={{ borderColor: '#e0d8cc', background: '#fdfbf7', color: '#6b5c3e' }}>
                      <div className="leading-relaxed mb-2">{mission.name}</div>
                      {status === 'completed' && (
                        <button
                          onClick={() => dispatch({ type: 'UNDO_MISSION', missionId: mission.id })}
                          className="text-xs px-2 py-0.5 rounded border"
                          style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}
                        >
                          이 미션 취소
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-3 text-xs" style={{ color: '#9c8c6e' }}>
            이 단계는 자동으로 진행됩니다...
          </div>
        )}

        {/* All missions done for episode */}
        {totalMissions > 0 && completedCount === totalMissions && (
          <div className="mt-2 py-2 px-3 rounded-xl text-center text-xs font-semibold" style={{ background: '#f0faf4', color: '#256040' }}>
            모든 미션 완료! 🎉
          </div>
        )}
      </div>

      {/* Today's expressions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#9c8c6e' }}>오늘의 표현</div>
          <span className="text-xs" style={{ color: '#8a6530' }}>{learnedCount}/{currentEpisode.expressions.length}</span>
        </div>
        <div className="space-y-2">
          {currentEpisode.expressions.map(expr => {
            const encounters = expressionEncounters[expr.id] ?? 0
            const MIN_ENCOUNTERS = 3
            const encounterLabel = `${Math.min(encounters, MIN_ENCOUNTERS)}/${MIN_ENCOUNTERS} 반복`
            return (
              <button
                key={expr.id}
                onClick={() => handleLearnExpression(expr.id, expr.xp, expr.learned)}
                className="w-full text-left p-2.5 rounded-xl border-2 transition-all"
                style={{
                  borderColor: expr.learned ? '#256040' : '#e0d8cc',
                  background: expr.learned ? '#f0faf4' : 'white',
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5 flex-shrink-0">{expr.learned ? '✅' : '📖'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium leading-relaxed" style={{ color: '#1a1208' }}>{expr.english}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6b5c3e' }}>{expr.korean}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#f2efe9', color: '#9c8c6e' }}>
                        {expr.context}
                      </div>
                      <div
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: encounters >= MIN_ENCOUNTERS ? '#f0faf4' : '#fdf8f0',
                          color: encounters >= MIN_ENCOUNTERS ? '#256040' : '#9c8c6e',
                        }}
                      >
                        {encounterLabel}
                      </div>
                    </div>
                    {!expr.learned && (
                      <div className="text-xs mt-1 font-semibold" style={{ color: '#8a6530' }}>클릭하면 +{expr.xp} XP</div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Work notes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#9c8c6e' }}>업무 노트</div>
          <button onClick={() => setShowAllNotes(!showAllNotes)} className="text-xs" style={{ color: '#8a6530' }}>
            {showAllNotes ? '접기' : '전체 보기'}
          </button>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e0d8cc' }}>
          {[
            { term: 'Incoterms', def: '국제 무역 조건 (FOB, CIF 등)' },
            { term: 'Cold Email', def: '사전 관계 없이 처음 보내는 영업 이메일' },
            { term: 'Follow-up', def: '이전 연락에 대한 후속 이메일' },
          ].map((note, i) => (
            <div key={i} className="px-3 py-2 border-b last:border-0" style={{ borderColor: '#e0d8cc' }}>
              <div className="text-xs font-semibold" style={{ color: '#8a6530' }}>{note.term}</div>
              <div className="text-xs" style={{ color: '#6b5c3e' }}>{note.def}</div>
            </div>
          ))}
        </div>
      </div>

      {/* XP summary */}
      <div className="bg-white rounded-xl border p-3" style={{ borderColor: '#e0d8cc' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: '#9c8c6e' }}>오늘 획득 XP</div>
        <div className="font-mono text-2xl font-semibold" style={{ color: '#8a6530' }}>
          {state.xp} <span className="text-sm font-normal">XP</span>
        </div>
        <div className="text-xs mt-1" style={{ color: '#9c8c6e' }}>Lv.{state.level} · 다음 레벨까지 {200 - (state.xp % 200)} XP</div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useLanguage } from './useLanguage'
import { MISSION_DEFS, STORY_BEATS, getMissionsForPhase } from '@/data/missions'
import { Message } from '@/types'

export function useMissionEngine() {
  const { state, dispatch } = useGame()
  const { lang } = useLanguage()
  const prevCompletedRef = useRef<string[]>([])
  const handledPhaseCompletion = useRef<Set<string>>(new Set())
  const handledStoryBeat = useRef<Set<string>>(new Set())
  const handledEmptyPhase = useRef<Set<string>>(new Set())
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Detect newly completed missions → award XP + check phase completion
  useEffect(() => {
    const prev = prevCompletedRef.current
    const newlyCompleted = state.completedMissionIds.filter(id => !prev.includes(id))
    prevCompletedRef.current = [...state.completedMissionIds]

    if (newlyCompleted.length === 0) return

    // Award XP for each newly completed mission
    newlyCompleted.forEach(missionId => {
      const def = MISSION_DEFS.find(m => m.id === missionId)
      if (!def) return
      dispatch({ type: 'ADD_XP', amount: def.xp })
      const episodeMissions = MISSION_DEFS.filter(m => m.episodeId === state.currentEpisodeId)
      const progressChunk = episodeMissions.length > 0 ? Math.round(80 / episodeMissions.length) : 10
      dispatch({ type: 'ADVANCE_EPISODE_PROGRESS', amount: progressChunk })
    })

    checkPhaseCompletion(state.currentEpisodeId, state.currentPhase, state.completedMissionIds)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.completedMissionIds])

  // When phase changes, re-evaluate — and auto-advance phases with no missions
  useEffect(() => {
    const episodeId = state.currentEpisodeId
    const phase = state.currentPhase
    const phaseMissions = getMissionsForPhase(episodeId, phase)

    if (phaseMissions.length === 0 && phase <= 5) {
      const key = `empty-${episodeId}-${phase}`
      if (!handledEmptyPhase.current.has(key)) {
        handledEmptyPhase.current.add(key)
        // Auto-advance empty phases after a brief pause so transitions feel natural
        const t = setTimeout(() => {
          dispatch({ type: 'ADVANCE_PHASE' })
        }, 2500)
        timers.current.push(t)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPhase, state.currentEpisodeId])

  function checkPhaseCompletion(episodeId: string, phase: number, completedIds: string[]) {
    const phaseMissions = getMissionsForPhase(episodeId, phase)
    if (phaseMissions.length === 0) return

    const allComplete = phaseMissions.every(m => completedIds.includes(m.id))
    if (!allComplete) return

    const key = `${episodeId}-${phase}`
    if (handledPhaseCompletion.current.has(key)) return
    handledPhaseCompletion.current.add(key)

    // Fire the story beat for this phase
    const beat = STORY_BEATS.find(b => b.episodeId === episodeId && b.afterPhase === phase)
    if (beat) {
      const beatKey = `beat-${beat.episodeId}-${beat.afterPhase}`
      if (!handledStoryBeat.current.has(beatKey)) {
        handledStoryBeat.current.add(beatKey)
        const msg = lang === 'ko' ? beat.message.ko : beat.message.en
        const t = setTimeout(() => {
          dispatch({
            type: 'ADD_MESSAGE',
            roomId: beat.roomId,
            message: {
              id: `beat-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              roomId: beat.roomId,
              senderId: beat.npcId,
              content: msg,
              type: 'text',
              timestamp: new Date(),
              isRead: false,
            } as Message,
          })
        }, beat.delayMs)
        timers.current.push(t)
      }
    }

    // Auto-advance to next phase after 3 seconds
    const t = setTimeout(() => {
      dispatch({ type: 'ADVANCE_PHASE' })
    }, 3000)
    timers.current.push(t)
  }

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])
}

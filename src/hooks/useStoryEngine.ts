'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useLanguage } from './useLanguage'
import { useAuth } from '@/contexts/AuthContext'
import { Message } from '@/types'

interface StoryMessage {
  senderId: string
  content: string
  delayMs: number
}

function loadExtProfile(uid: string) {
  try { return JSON.parse(localStorage.getItem(`kt_ext_${uid}`) || 'null') } catch { return null }
}

export function useStoryEngine() {
  const { state, dispatch } = useGame()
  const { lang } = useLanguage()
  const { user } = useAuth()
  const firedMeeting = useRef(false)
  const firedDms = useRef<Set<string>>(new Set())
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const dispatchStoryMessages = useCallback(
    (roomId: string, messages: StoryMessage[]) => {
      messages.forEach(({ senderId, content, delayMs }) => {
        const t = setTimeout(() => {
          dispatch({
            type: 'ADD_MESSAGE',
            roomId,
            message: {
              id: `story-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              roomId,
              senderId,
              content,
              type: 'text',
              timestamp: new Date(),
              isRead: false,
            } as Message,
          })
        }, delayMs)
        timers.current.push(t)
      })
    },
    [dispatch],
  )

  const callStoryAPI = useCallback(
    async (type: 'team_meeting' | 'npc_dm', npcId?: string) => {
      const ext = user ? loadExtProfile(user.uid) : null
      const recentRoom = type === 'team_meeting' ? 'team-general' : `dm-${npcId}`
      const recentMessages = (state.messages[recentRoom] || [])
        .slice(-8)
        .map(m => ({ senderId: m.senderId, content: m.content.slice(0, 120) }))

      // For npc_dm, put the NPC id first so the API knows who's messaging
      const contextMessages = type === 'npc_dm' && npcId
        ? [{ senderId: npcId, content: '' }, ...recentMessages]
        : recentMessages

      const context = {
        episode: {
          season: state.currentEpisode.season,
          episode: state.currentEpisode.episode,
          title: state.currentEpisode.title,
        },
        relationships: Object.fromEntries(state.npcs.map(n => [n.id, n.relationship])),
        recentMessages: contextMessages,
        lang,
        currentSeason: state.currentSeason,
        playerName: user?.email?.split('@')[0],
        playerProfile: ext ? { industry: ext.industry, jobGoal: ext.jobGoal } : undefined,
      }

      try {
        const res = await fetch('/api/story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, context }),
        })
        if (!res.ok) return
        const { messages } = await res.json()
        const roomId = type === 'team_meeting' ? 'team-general' : `dm-${npcId}`
        dispatchStoryMessages(roomId, messages)
      } catch (err) {
        console.error('Story engine:', err)
      }
    },
    [state, lang, user, dispatchStoryMessages],
  )

  // Schedule autonomous events once on mount
  useEffect(() => {
    // Individual NPC DMs — stagger them
    const dmSchedule: Array<{ npcId: string; delay: number }> = [
      { npcId: 'james', delay: 45_000 + Math.random() * 30_000 },   // ~45-75s
      { npcId: 'min',   delay: 180_000 + Math.random() * 60_000 },  // ~3-4 min
    ]

    dmSchedule.forEach(({ npcId, delay }) => {
      if (firedDms.current.has(npcId)) return
      const t = setTimeout(() => {
        firedDms.current.add(npcId)
        callStoryAPI('npc_dm', npcId)
      }, delay)
      timers.current.push(t)
    })

    // Team meeting — ~5-7 minutes in
    const meetingDelay = 300_000 + Math.random() * 120_000
    const mt = setTimeout(() => {
      if (!firedMeeting.current) {
        firedMeeting.current = true
        callStoryAPI('team_meeting')
      }
    }, meetingDelay)
    timers.current.push(mt)

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Mount once — callStoryAPI is stable enough via the captured refs

  // Also trigger team meeting after player sends 5th message total
  const allPlayerMessages = Object.values(state.messages)
    .flat()
    .filter(m => m.senderId === 'player').length

  useEffect(() => {
    if (allPlayerMessages === 5 && !firedMeeting.current) {
      firedMeeting.current = true
      // Small delay so it doesn't interrupt immediately
      const t = setTimeout(() => callStoryAPI('team_meeting'), 12_000)
      timers.current.push(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlayerMessages])
}

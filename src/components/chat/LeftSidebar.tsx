'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { NPCS } from '@/data/npcs'
import { useLanguage } from '@/hooks/useLanguage'
import { AppView } from '@/types'
import LanguageSwitcher from './LanguageSwitcher'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'

type CharKey = keyof typeof CHARACTER_IMAGES
const getChar = (id: string) => CHARACTER_IMAGES[id as CharKey]

interface NpcPopup {
  npcId: string
  top: number
  left: number
}

interface Props {
  view: AppView
  onViewChange: (v: AppView) => void
  onOpenProfile: () => void
  isAfterWork: boolean
  gameTimeStr: string
}

const NAV = [
  { key: 'chat' as AppView, icon: '💬', label: 'Chat' },
  { key: 'notes' as AppView, icon: '📚', label: 'Notes' },
  { key: 'profiles' as AppView, icon: '👥', label: 'People' },
  { key: 'progress' as AppView, icon: '🗺️', label: 'Progress' },
]

export default function LeftSidebar({ view, onViewChange, onOpenProfile, isAfterWork, gameTimeStr }: Props) {
  const { profile, logout } = useAuth()
  const { state, dispatch } = useGame()
  const { lang, setLang } = useLanguage()
  const [popup, setPopup] = useState<NpcPopup | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getNpc = (id: string) => NPCS.find(n => n.id === id)

  const handleNpcEnter = (npcId: string, el: HTMLElement) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    const rect = el.getBoundingClientRect()
    setPopup({ npcId, top: rect.top, left: rect.right + 8 })
  }

  const handleNpcLeave = () => {
    hoverTimer.current = setTimeout(() => setPopup(null), 200)
  }

  const popupNpc = popup ? NPCS.find(n => n.id === popup.npcId) : null

  return (
    <div className="h-full flex flex-col text-sm relative">
      {/* Logo + game clock + language */}
      <div className="px-3 py-2.5 border-b flex items-center gap-2 flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
        <span className="font-serif text-base" style={{ color: '#8a6530' }}>KoraTrade</span>
        <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: isAfterWork ? '#fef0e8' : '#faf0dd', color: isAfterWork ? '#c45a00' : '#8a6530' }}>
          {gameTimeStr}
        </span>
        <div className="ml-auto">
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex border-b px-1" style={{ borderColor: '#e0d8cc' }}>
        {NAV.map(n => (
          <button
            key={n.key}
            onClick={() => onViewChange(n.key)}
            className="flex-1 py-2 flex flex-col items-center gap-0.5 transition-all"
            style={{ color: view === n.key ? '#8a6530' : '#9c8c6e', borderBottom: `2px solid ${view === n.key ? '#8a6530' : 'transparent'}` }}
          >
            <span>{n.icon}</span>
            <span className="text-xs">{n.label}</span>
          </button>
        ))}
      </div>

      {/* Rooms — only visible in chat view */}
      <div className="flex-1 overflow-y-auto py-2">
        {view === 'chat' ? (
          <>
            <div className="px-3 mb-1">
              <p className="text-xs font-semibold px-1 mb-1.5 tracking-wide uppercase" style={{ color: '#9c8c6e' }}>채널</p>
              {state.rooms.filter(r => r.type === 'group').map(room => (
                <button
                  key={room.id}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_ROOM', roomId: room.id })}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left transition-colors"
                  style={{ background: state.activeRoomId === room.id ? '#ede8e0' : 'transparent' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: '#f2efe9' }}>💼</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: '#1a1208', fontSize: '13px' }}>{room.name}</div>
                    {room.lastMessage && <div className="text-xs truncate" style={{ color: '#9c8c6e' }}>{room.lastMessage}</div>}
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="text-xs text-white px-1.5 py-0.5 rounded-full" style={{ background: '#8a6530' }}>{room.unreadCount}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="px-3 mt-3">
              <p className="text-xs font-semibold px-1 mb-1.5 tracking-wide uppercase" style={{ color: '#9c8c6e' }}>다이렉트</p>
              {state.rooms.filter(r => r.type === 'dm').map(room => {
                const npc = getNpc(room.participants[0])
                const ch = npc ? getChar(npc.id) : undefined
                return (
                  <button
                    key={room.id}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_ROOM', roomId: room.id })}
                    onMouseEnter={e => npc && handleNpcEnter(npc.id, e.currentTarget)}
                    onMouseLeave={handleNpcLeave}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left transition-colors"
                    style={{ background: state.activeRoomId === room.id ? '#ede8e0' : 'transparent' }}
                  >
                    <div className="relative flex-shrink-0 group/avatar">
                      {npc && ch?.crop
                        ? <CharacterAvatar src={ch.crop} alt={npc.name} variant="small" size={40}
                            bg={ch.bg} border={ch.accent}
                            className="group-hover/avatar:[border-color:rgba(138,101,48,0.6)] transition-all" />
                        : <div className="w-10 h-10 rounded-full flex items-center justify-center text-base" style={{ background: '#f2efe9' }}>{npc?.avatar || '👤'}</div>
                      }
                      {npc?.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#256040' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" style={{ color: '#1a1208', fontSize: '13px' }}>{room.name}</div>
                      {room.lastMessage && <div className="text-xs truncate" style={{ color: '#9c8c6e' }}>{room.lastMessage}</div>}
                    </div>
                    {room.unreadCount > 0 && (
                      <span className="text-xs text-white px-1.5 py-0.5 rounded-full" style={{ background: '#8a6530' }}>{room.unreadCount}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="px-4 py-6 text-center text-xs" style={{ color: '#9c8c6e' }}>
            {view === 'notes' ? '업무 노트' : '인물 도감'}이 오른쪽에 표시됩니다
          </div>
        )}
      </div>

      {/* Profile footer */}
      {profile && (() => {
        const userKey = `user_${profile.avatarGender ?? 'female'}` as CharKey
        const userCh = CHARACTER_IMAGES[userKey]
        return (
          <div className="border-t p-3 flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
            <button onClick={onOpenProfile} className="w-full flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <CharacterAvatar
                src={userCh.crop}
                alt={profile.name}
                variant="small"
                size={40}
                bg={userCh.bg}
                border={userCh.accent}
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium truncate" style={{ color: '#1a1208', fontSize: '12px' }}>{profile.name}</div>
                <div className="text-xs" style={{ color: '#9c8c6e' }}>Lv.{profile.level} · {state.xp} XP</div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); logout() }}
                onKeyDown={e => e.key === 'Enter' && logout()}
                className="text-xs px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                style={{ color: '#9c8c6e' }}
              >
                퇴근
              </div>
            </button>
            <div className="mt-2 h-1 rounded-full" style={{ background: '#e0d8cc' }}>
              <div className="h-full rounded-full transition-all" style={{ background: '#8a6530', width: `${(state.xp % 200) / 200 * 100}%` }} />
            </div>
          </div>
        )
      })()}

      {/* NPC hover popup — fixed position */}
      {popup && popupNpc && (() => {
        const ch = getChar(popupNpc.id)
        return (
          <div
            onMouseEnter={() => hoverTimer.current && clearTimeout(hoverTimer.current)}
            onMouseLeave={handleNpcLeave}
            className="fixed z-50 w-52 rounded-2xl shadow-xl border p-3"
            style={{ top: Math.min(popup.top, window.innerHeight - 200), left: popup.left, background: ch?.bg ?? 'white', borderColor: '#e0d8cc' }}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="relative">
                {ch?.crop
                  ? <CharacterAvatar src={ch.crop} alt={popupNpc.name} variant="small" size={40}
                      bg={ch.bg} border={ch.accent} />
                  : <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: '#f2efe9' }}>{popupNpc.avatar}</div>
                }
                {popupNpc.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#256040' }} />}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>{popupNpc.name}</div>
                <div className="text-xs" style={{ color: '#9c8c6e' }}>{popupNpc.roleKr}</div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#9c8c6e' }}>관계도</span>
                <span className="text-xs font-mono" style={{ color: '#8a6530' }}>{popupNpc.relationship}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#e0d8cc' }}>
                <div className="h-full rounded-full transition-all" style={{ background: '#8a6530', width: `${popupNpc.relationship}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: popupNpc.isOnline ? '#256040' : '#ccc' }} />
              <span className="text-xs" style={{ color: '#9c8c6e' }}>{isAfterWork ? '퇴근 🏠' : popupNpc.moodLabel}</span>
            </div>
            <div className="text-xs px-2 py-1.5 rounded-lg" style={{ background: '#f2efe9', color: '#6b5c3e' }}>
              💼 {popupNpc.personality.split(',')[0].trim()}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

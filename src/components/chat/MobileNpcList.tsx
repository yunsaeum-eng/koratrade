'use client'

import { useGame } from '@/contexts/GameContext'
import { useLanguage } from '@/hooks/useLanguage'
import { NPCS } from '@/data/npcs'
import { CHARACTER_IMAGES } from '@/config/characters'
import CharacterAvatar from '@/components/ui/CharacterAvatar'

type CharKey = keyof typeof CHARACTER_IMAGES

interface Props {
  onSelectRoom: () => void
}

export default function MobileNpcList({ onSelectRoom }: Props) {
  const { state, dispatch } = useGame()
  const { isEn } = useLanguage()

  const handleSelect = (roomId: string) => {
    dispatch({ type: 'SET_ACTIVE_ROOM', roomId })
    onSelectRoom()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#faf8f4' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
        <span className="font-serif text-lg" style={{ color: '#8a6530' }}>KoraTrade</span>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {state.rooms.map(room => {
          const npcId = room.type === 'dm' ? room.participants[0] : null
          const npc = npcId ? NPCS.find(n => n.id === npcId) : null
          const ch = npc ? CHARACTER_IMAGES[npc.id as CharKey] : undefined
          const isActive = state.activeRoomId === room.id

          return (
            <button
              key={room.id}
              onClick={() => handleSelect(room.id)}
              className="w-full flex items-center gap-3 px-4 text-left border-b transition-colors"
              style={{
                background: isActive ? '#ede8e0' : 'transparent',
                borderColor: '#f0ece4',
                minHeight: 64,
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              {/* Avatar */}
              {room.type === 'group' ? (
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#f2efe9' }}>💼</div>
              ) : npc && ch?.crop ? (
                <div className="relative flex-shrink-0">
                  <CharacterAvatar src={ch.crop} alt={npc.name} variant="small" size={44}
                    bg={ch.bg} border={ch.accent} />
                  {npc.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: '#256040' }} />
                  )}
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#f2efe9' }}>{npc?.avatar || '👤'}</div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate" style={{ color: '#1a1208' }}>{room.name}</div>
                {room.lastMessage
                  ? <div className="text-xs truncate mt-0.5" style={{ color: '#9c8c6e' }}>{room.lastMessage}</div>
                  : <div className="text-xs mt-0.5" style={{ color: '#b8a88a' }}>
                      {room.type === 'group' ? (isEn ? 'Team Channel' : '팀 채널') : (isEn ? (npc?.role ?? '') : (npc?.roleKr ?? ''))}
                    </div>
                }
              </div>

              {/* Unread */}
              {room.unreadCount > 0 && (
                <span className="text-xs text-white px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: '#8a6530' }}>{room.unreadCount}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { NPCS } from '@/data/npcs'
import { useLanguage } from '@/hooks/useLanguage'
import { AppView } from '@/types'
import { TranslationKey } from '@/data/translations'
import LanguageSwitcher from './LanguageSwitcher'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTER_IMAGES } from '@/config/characters'
import { resetProgress, deleteUserData } from '@/services/gameData'
import { supabase } from '@/lib/supabase'

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

const NAV: { key: AppView; icon: string; tKey: TranslationKey }[] = [
  { key: 'chat',     icon: '💬', tKey: 'chat' },
  { key: 'notes',    icon: '📚', tKey: 'notes' },
  { key: 'profiles', icon: '👥', tKey: 'people' },
  { key: 'progress', icon: '🗺️', tKey: 'progress' },
]

export default function LeftSidebar({ view, onViewChange, onOpenProfile, isAfterWork, gameTimeStr }: Props) {
  const { profile, logout } = useAuth()
  const { state, dispatch } = useGame()
  const { lang, setLang, t, isEn } = useLanguage()
  const [popup, setPopup] = useState<NpcPopup | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsMode, setSettingsMode] = useState<'menu' | 'reset' | 'delete'>('menu')

  const handleGearReset = async () => {
    if (!profile) return
    await resetProgress(profile.uid).catch(console.error)
    window.location.href = '/commute'
  }

  const handleGearDelete = async () => {
    if (!profile) return
    await deleteUserData(profile.uid).catch(console.error)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getNpc = (id: string) => NPCS.find(n => n.id === id)

  const handleNpcEnter = (npcId: string, el: HTMLElement) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    const rect = el.getBoundingClientRect()
    setPopup({ npcId, top: rect.top, left: rect.right + 8 })
  }

  const handleNpcLeave = () => {
    hoverTimer.current = setTimeout(() => setPopup(null), 200)
  }

  const popupNpc = popup ? state.npcs.find(n => n.id === popup.npcId) : null

  return (
    <div className="h-full flex flex-col text-sm relative">
      {/* Logo + game clock + language */}
      <div className="px-3 py-2.5 border-b flex items-center gap-2 flex-shrink-0" style={{ borderColor: '#e0d8cc' }}>
        <span className="font-serif text-base" style={{ color: '#8a6530' }}>KoraTrade</span>
        <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: isAfterWork ? '#fef0e8' : '#faf0dd', color: isAfterWork ? '#c45a00' : '#8a6530' }}>
          {gameTimeStr}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher lang={lang} onChange={setLang} />
          <div className="relative">
            <button
              onClick={() => { setSettingsOpen(o => !o); setSettingsMode('menu') }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-base transition-all"
              style={{ background: settingsOpen ? '#faf0dd' : 'transparent' }}
              title="설정"
            >⚙️</button>
            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-lg border z-50 overflow-hidden"
                  style={{ background: 'white', borderColor: '#e0d8cc' }}>
                  {settingsMode === 'menu' && (
                    <>
                      <button onClick={() => { onOpenProfile(); setSettingsOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#1a1208' }}>{t('editProfile')}</button>
                      <div style={{ height: 1, background: '#f0ece4' }} />
                      <button onClick={() => setSettingsMode('reset')}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#c0392b' }}>{t('resetProgress')}</button>
                      <button onClick={() => setSettingsMode('delete')}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#c0392b' }}>{t('deleteAccount')}</button>
                      <div style={{ height: 1, background: '#f0ece4' }} />
                      <button onClick={() => { logout(); setSettingsOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#9c8c6e' }}>{t('logoutMenu')}</button>
                    </>
                  )}
                  {settingsMode === 'reset' && (
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-medium text-center" style={{ color: '#c0392b' }}>{t('confirmReset')}</p>
                      <p className="text-xs text-center" style={{ color: '#9c8c6e' }}>{t('resetWarning')}</p>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setSettingsMode('menu')} className="flex-1 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}>{t('cancel')}</button>
                        <button onClick={handleGearReset} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#c0392b' }}>{t('doReset')}</button>
                      </div>
                    </div>
                  )}
                  {settingsMode === 'delete' && (
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-medium text-center" style={{ color: '#c0392b' }}>{t('confirmDelete')}</p>
                      <p className="text-xs text-center" style={{ color: '#9c8c6e' }}>{t('deleteWarning')}</p>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setSettingsMode('menu')} className="flex-1 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}>{t('cancel')}</button>
                        <button onClick={handleGearDelete} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#c0392b' }}>{t('doDelete')}</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
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
            <span className="text-xs">{t(n.tKey)}</span>
          </button>
        ))}
      </div>

      {/* Rooms — only visible in chat view */}
      <div className="flex-1 overflow-y-auto py-2">
        {view === 'chat' ? (
          <>
            <div className="px-3 mb-1">
              <p className="text-xs font-semibold px-1 mb-1.5 tracking-wide uppercase" style={{ color: '#9c8c6e' }}>{t('channels')}</p>
              {state.rooms.filter(r => r.type === 'group').map(room => (
                <button
                  key={room.id}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_ROOM', roomId: room.id })}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left transition-colors"
                  style={{ background: state.activeRoomId === room.id ? '#ede8e0' : 'transparent' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: '#f2efe9' }}>💼</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: '#1a1208', fontSize: '13px' }}>{isEn && room.id === 'team-general' ? 'Overseas Sales 💼' : room.name}</div>
                    {room.lastMessage && <div className="text-xs truncate" style={{ color: '#9c8c6e' }}>{room.lastMessage}</div>}
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="text-xs text-white px-1.5 py-0.5 rounded-full" style={{ background: '#8a6530' }}>{room.unreadCount}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="px-3 mt-3">
              <p className="text-xs font-semibold px-1 mb-1.5 tracking-wide uppercase" style={{ color: '#9c8c6e' }}>{t('direct')}</p>
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
                      <div className="font-medium truncate" style={{ color: '#1a1208', fontSize: '13px' }}>{isEn && room.id === 'dm-park' ? 'Mr. Park' : room.name}</div>
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
            {isEn
              ? (view === 'notes' ? 'Work Notes are shown on the right.' : 'Character Profiles are shown on the right.')
              : `${view === 'notes' ? '업무 노트' : '인물 도감'}이 오른쪽에 표시됩니다`}
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
                {t('logout')}
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
        const ch = getChar(popup.npcId)
        return (
          <div
            key={popup.npcId}
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
                <div className="text-xs" style={{ color: '#9c8c6e' }}>{isEn ? popupNpc.role : popupNpc.roleKr}</div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#9c8c6e' }}>{t('relationship')}</span>
                <span className="text-xs font-mono" style={{ color: '#8a6530' }}>{popupNpc.relationship}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#e0d8cc' }}>
                <div className="h-full rounded-full transition-all" style={{ background: '#8a6530', width: `${popupNpc.relationship}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: popupNpc.isOnline ? '#256040' : '#ccc' }} />
              <span className="text-xs" style={{ color: '#9c8c6e' }}>
                {isAfterWork ? t('afterWork') : (isEn ? (popupNpc.moodLabelEn ?? popupNpc.moodLabel) : popupNpc.moodLabel)}
              </span>
            </div>
            <div className="text-xs px-2 py-1.5 rounded-lg" style={{ background: '#f2efe9', color: '#6b5c3e' }}>
              💼 {isEn ? (popupNpc.personalityEn ?? popupNpc.personality.split(',')[0].trim()) : popupNpc.personality.split(',')[0].trim()}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

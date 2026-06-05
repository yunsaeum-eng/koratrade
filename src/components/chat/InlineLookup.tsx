'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import TermHighlighter from './TermHighlighter'
import { useGame } from '@/contexts/GameContext'
import { WorkNote } from '@/types'

interface WordTooltip {
  word: string
  korean: string
  example: string
  x: number
  y: number
  bottom: number
}

interface SelectionBar {
  phrase: string
  x: number
  y: number
  bottom: number
}

interface Props {
  text: string
  episodeNum: number
  lang: string
  senderId: string
  episodeLabel: string  // e.g. "S1EP01"
}

let idCtr = Date.now()
const uid = () => `wn-${++idCtr}`

export default function InlineLookup({ text, episodeNum, lang, senderId, episodeLabel }: Props) {
  const { state, dispatch } = useGame()
  const [wordTooltip, setWordTooltip] = useState<WordTooltip | null>(null)
  const [selectionBar, setSelectionBar] = useState<SelectionBar | null>(null)
  const [wordLoading, setWordLoading] = useState(false)
  const [savedToast, setSavedToast] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e instanceof MouseEvent ? e.target : e.touches[0]?.target
      if (containerRef.current && target && !containerRef.current.contains(target as Node)) {
        setWordTooltip(null)
        setSelectionBar(null)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  const flashSaved = useCallback(() => {
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2000)
  }, [])

  const saveToExpressions = useCallback(async (phrase: string, preloadedKorean?: string) => {
    let korean = preloadedKorean ?? ''
    if (!korean) {
      try {
        const res = await fetch('/api/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word: phrase, context: text, type: 'phrase' }),
        })
        const data = await res.json()
        korean = data.korean ?? ''
      } catch {/* ignore */}
    }

    const npc = state.npcs.find(n => n.id === senderId)
    const note: WorkNote = {
      id: uid(),
      type: 'expression',
      content: phrase,
      translation: korean || undefined,
      tag: `${npc?.name ?? senderId} · ${episodeLabel}`,
      addedAt: new Date().toISOString(),
      source: 'manual',
    }
    dispatch({ type: 'ADD_WORK_NOTE', note })
    flashSaved()
    setSelectionBar(null)
    setWordTooltip(null)
    window.getSelection()?.removeAllRanges()
  }, [text, senderId, episodeLabel, state.npcs, dispatch, flashSaved])

  const handleDoubleClick = useCallback(async (e: React.MouseEvent) => {
    const sel = window.getSelection()
    const word = sel?.toString().trim()
    if (!word || word.includes('\n') || word.split(/\s+/).length > 2) return

    e.stopPropagation()
    const target = e.target as HTMLElement
    const rect = target.getBoundingClientRect()
    setSelectionBar(null)
    setWordTooltip({ word, korean: '', example: '', x: rect.left + rect.width / 2, y: rect.top, bottom: rect.bottom })
    setWordLoading(true)

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, context: text, type: 'word' }),
      })
      const data = await res.json()
      setWordTooltip(prev => prev ? { ...prev, korean: data.korean ?? '', example: data.example ?? '' } : null)
    } catch {
      setWordTooltip(prev => prev ? { ...prev, korean: '번역 실패' } : null)
    }
    setWordLoading(false)
  }, [text])

  const handleMouseUp = useCallback(() => {
    // Let double-click handle single-word selections
    const sel = window.getSelection()
    const phrase = sel?.toString().trim()
    if (!phrase) { setSelectionBar(null); return }

    const words = phrase.trim().split(/\s+/).filter(Boolean)
    if (words.length < 2 || words.length > 6) return

    // Ensure selection is inside this container
    if (!containerRef.current) return
    const range = sel!.getRangeAt(0)
    if (!containerRef.current.contains(range.commonAncestorContainer)) return

    try {
      const rect = range.getBoundingClientRect()
      setWordTooltip(null)
      setSelectionBar({ phrase, x: rect.left + rect.width / 2, y: rect.top, bottom: rect.bottom })
    } catch {/* ignore */}
  }, [])

  // Touch: delay slightly so iOS can finalize the selection before we read it
  const handleTouchEnd = useCallback(() => {
    setTimeout(handleMouseUp, 150)
  }, [handleMouseUp])

  return (
    <div ref={containerRef} onDoubleClick={handleDoubleClick} onMouseUp={handleMouseUp} onTouchEnd={handleTouchEnd}>
      <TermHighlighter text={text} episodeNum={episodeNum} lang={lang} />

      {/* Word double-click tooltip */}
      {wordTooltip && (
        <WordTooltipCard
          tooltip={wordTooltip}
          loading={wordLoading}
          onAdd={() => saveToExpressions(wordTooltip.word, wordTooltip.korean)}
          onDismiss={() => setWordTooltip(null)}
        />
      )}

      {/* Phrase selection action bar */}
      {selectionBar && (
        <SelectionActionBar
          bar={selectionBar}
          context={text}
          onSave={saveToExpressions}
          onDismiss={() => setSelectionBar(null)}
        />
      )}

      {/* Saved confirmation toast */}
      {savedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full text-xs font-semibold shadow-lg pointer-events-none"
          style={{ background: '#256040', color: 'white' }}>
          표현 저장됨 ✓
        </div>
      )}
    </div>
  )
}

// ── WordTooltipCard ────────────────────────────────────────────────────────────

function WordTooltipCard({ tooltip, loading, onAdd, onDismiss }: {
  tooltip: WordTooltip
  loading: boolean
  onAdd: () => void
  onDismiss: () => void
}) {
  const W = 240
  const spaceAbove = tooltip.y > 120
  const left = Math.min(Math.max(tooltip.x - W / 2, 8), (typeof window !== 'undefined' ? window.innerWidth : 600) - W - 8)

  return (
    <div
      className="fixed z-50 rounded-xl shadow-xl border p-3 text-xs"
      style={{
        left,
        top: spaceAbove ? tooltip.y - 8 : tooltip.bottom + 8,
        transform: spaceAbove ? 'translateY(-100%)' : 'none',
        background: 'white',
        borderColor: '#c8b88a',
        width: W,
      }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="font-semibold" style={{ color: '#8a6530' }}>{tooltip.word}</span>
        <button onClick={onDismiss} className="text-xs flex-shrink-0 opacity-40 hover:opacity-100" style={{ color: '#9c8c6e' }}>✕</button>
      </div>
      {loading ? (
        <div style={{ color: '#9c8c6e' }}>번역 중...</div>
      ) : (
        <>
          {tooltip.korean && <div className="mb-1" style={{ color: '#1a1208' }}>{tooltip.korean}</div>}
          {tooltip.example && <div className="mb-2 italic text-xs leading-relaxed" style={{ color: '#6b5c3e' }}>{tooltip.example}</div>}
          <button
            onClick={e => { e.stopPropagation(); onAdd() }}
            className="w-full py-1.5 rounded-lg text-xs font-medium text-left px-2"
            style={{ background: '#faf0dd', color: '#8a6530' }}
          >
            + 표현 모음에 추가
          </button>
        </>
      )}
    </div>
  )
}

// ── SelectionActionBar ─────────────────────────────────────────────────────────

function SelectionActionBar({ bar, context, onSave, onDismiss }: {
  bar: SelectionBar
  context: string
  onSave: (phrase: string, korean?: string) => Promise<void>
  onDismiss: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [lookupData, setLookupData] = useState<{ korean?: string; usage?: string; similar?: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const W = 200
  const spaceAbove = bar.y > 60
  const left = Math.min(Math.max(bar.x - W / 2, 8), (typeof window !== 'undefined' ? window.innerWidth : 600) - W - 8)

  const handleLookup = async () => {
    setExpanded(true)
    setLoading(true)
    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: bar.phrase, context, type: 'phrase' }),
      })
      setLookupData(await res.json())
    } catch {
      setLookupData({ korean: '번역 실패' })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(bar.phrase, lookupData?.korean)
    setSaving(false)
  }

  return (
    <div
      className="fixed z-50 rounded-xl shadow-xl border"
      style={{
        left,
        top: spaceAbove ? bar.y - 8 : bar.bottom + 8,
        transform: spaceAbove ? 'translateY(-100%)' : 'none',
        background: 'white',
        borderColor: '#c8b88a',
        width: expanded ? 260 : W,
      }}
    >
      {!expanded ? (
        <div className="flex items-center gap-1 p-1.5">
          <button
            onClick={handleLookup}
            className="flex-1 text-xs px-2 py-1.5 rounded-lg font-medium"
            style={{ background: '#faf0dd', color: '#8a6530' }}
          >
            🔍 뜻 보기
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 text-xs px-2 py-1.5 rounded-lg font-medium disabled:opacity-50"
            style={{ background: '#f0faf4', color: '#256040' }}
          >
            📒 표현 저장
          </button>
          <button onClick={onDismiss} className="text-xs px-1" style={{ color: '#9c8c6e' }}>✕</button>
        </div>
      ) : (
        <div className="p-3 text-xs">
          <div className="font-semibold mb-2 pr-4" style={{ color: '#8a6530' }}>"{bar.phrase}"</div>
          {loading ? (
            <div style={{ color: '#9c8c6e' }}>설명 불러오는 중...</div>
          ) : lookupData ? (
            <div className="space-y-1">
              {lookupData.korean && <div style={{ color: '#1a1208' }}><strong>의미:</strong> {lookupData.korean}</div>}
              {lookupData.usage && <div style={{ color: '#6b5c3e' }}><strong>사용 시점:</strong> {lookupData.usage}</div>}
              {lookupData.similar?.length ? (
                <div style={{ color: '#6b5c3e' }}><strong>유사 표현:</strong> {lookupData.similar.join(', ')}</div>
              ) : null}
            </div>
          ) : null}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
              style={{ background: '#f0faf4', color: '#256040' }}
            >
              📒 표현 저장
            </button>
            <button onClick={onDismiss} className="px-2 py-1.5 rounded-lg text-xs" style={{ color: '#9c8c6e' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}

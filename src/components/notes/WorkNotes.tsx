'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { WorkNote } from '@/types'

type Tab = 'term' | 'expression' | 'mistake' | 'memo'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'term',       label: '용어집',   icon: '📚' },
  { key: 'expression', label: '표현모음', icon: '💬' },
  { key: 'mistake',    label: '틀린문장', icon: '❌' },
  { key: 'memo',       label: '내 메모',  icon: '📝' },
]

let idCounter = Date.now()
const newId = () => `wn-${++idCounter}`

interface EditState {
  content: string
  translation: string
  context: string
  tag: string
}

export default function WorkNotes() {
  const { state, dispatch } = useGame()
  const [tab, setTab] = useState<Tab>('term')
  const [memoText, setMemoText] = useState('')
  const [addingType, setAddingType] = useState<Tab | null>(null)
  const [form, setForm] = useState({ content: '', translation: '', context: '', tag: '' })

  // inline editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ content: '', translation: '', context: '', tag: '' })

  const notes = state.workNotes.filter(n => n.type === tab)

  const addNote = () => {
    if (!form.content.trim()) return
    const note: WorkNote = {
      id: newId(),
      type: addingType!,
      content: form.content,
      translation: form.translation || undefined,
      context: form.context || undefined,
      tag: form.tag || undefined,
      addedAt: new Date().toISOString(),
      source: 'manual',
    }
    dispatch({ type: 'ADD_WORK_NOTE', note })
    setForm({ content: '', translation: '', context: '', tag: '' })
    setAddingType(null)
  }

  const saveMemo = () => {
    if (!memoText.trim()) return
    dispatch({
      type: 'ADD_WORK_NOTE',
      note: { id: newId(), type: 'memo', content: memoText, addedAt: new Date().toISOString(), source: 'manual' },
    })
    setMemoText('')
  }

  const startEdit = (note: WorkNote) => {
    setEditingId(note.id)
    setEditForm({
      content: note.content,
      translation: note.translation ?? '',
      context: note.context ?? '',
      tag: note.tag ?? '',
    })
  }

  const saveEdit = (note: WorkNote) => {
    if (!editForm.content.trim()) return
    dispatch({
      type: 'UPDATE_WORK_NOTE',
      note: {
        ...note,
        content: editForm.content,
        translation: editForm.translation || undefined,
        context: editForm.context || undefined,
        tag: editForm.tag || undefined,
      },
    })
    setEditingId(null)
  }

  const saveMemoEdit = (note: WorkNote) => {
    if (!editForm.content.trim()) return
    dispatch({ type: 'UPDATE_WORK_NOTE', note: { ...note, content: editForm.content } })
    setEditingId(null)
  }

  const tagColor = (source: 'auto' | 'manual') =>
    source === 'auto'
      ? { background: '#f0faf4', color: '#256040' }
      : { background: '#f2efe9', color: '#6b5c3e' }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'white' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: '#e0d8cc' }}>
        <div className="font-semibold text-sm" style={{ color: '#1a1208' }}>업무 노트</div>
        <div className="text-xs mt-0.5" style={{ color: '#9c8c6e' }}>학습한 내용이 자동 저장됩니다</div>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-1" style={{ borderColor: '#e0d8cc' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-2 text-xs font-medium transition-all border-b-2"
            style={{
              borderColor: tab === t.key ? '#8a6530' : 'transparent',
              color: tab === t.key ? '#8a6530' : '#9c8c6e',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Memo tab */}
      {tab === 'memo' ? (
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
          <div className="flex gap-2">
            <textarea
              value={memoText}
              onChange={e => setMemoText(e.target.value)}
              placeholder="자유롭게 메모하세요..."
              className="flex-1 resize-none rounded-xl border p-3 text-sm outline-none"
              style={{ borderColor: '#e0d8cc', background: '#faf8f4', color: '#1a1208', height: '80px' }}
            />
            <button
              onClick={saveMemo}
              disabled={!memoText.trim()}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-white self-end disabled:opacity-40"
              style={{ background: '#8a6530' }}
            >
              저장
            </button>
          </div>
          <div className="space-y-2">
            {state.workNotes.filter(n => n.type === 'memo').map(note => (
              <div key={note.id} className="group relative p-3 rounded-xl border" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editForm.content}
                      onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                      className="w-full resize-none rounded-lg border p-2 text-sm outline-none"
                      style={{ borderColor: '#c8b88a', background: 'white', color: '#1a1208', height: '70px' }}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveMemoEdit(note)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#8a6530' }}>저장</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#9c8c6e' }}>취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed pr-12" style={{ color: '#1a1208' }}>{note.content}</p>
                    <div className="text-xs mt-1" style={{ color: '#9c8c6e' }}>
                      {new Date(note.addedAt).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => startEdit(note)} className="text-xs p-1 rounded hover:bg-amber-50" title="편집">✏️</button>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'DELETE_WORK_NOTE', id: note.id })}
                      className="absolute top-2 right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#9c8c6e' }}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Add button */}
          <div className="px-4 py-2 border-b" style={{ borderColor: '#e0d8cc' }}>
            {addingType === tab ? (
              <div className="space-y-2">
                <input
                  placeholder={tab === 'term' ? '용어' : tab === 'expression' ? '표현 (영어)' : '틀린 문장'}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                />
                {tab !== 'mistake' && (
                  <input
                    placeholder="한국어 번역"
                    value={form.translation}
                    onChange={e => setForm(f => ({ ...f, translation: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                    style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                  />
                )}
                <input
                  placeholder="상황/태그"
                  value={form.tag}
                  onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}
                />
                <div className="flex gap-2">
                  <button onClick={addNote} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#8a6530' }}>저장</button>
                  <button onClick={() => setAddingType(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#9c8c6e' }}>취소</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingType(tab)}
                className="w-full py-1.5 rounded-lg border border-dashed text-xs transition-colors hover:border-amber-400"
                style={{ borderColor: '#e0d8cc', color: '#9c8c6e' }}
              >
                + 직접 추가
              </button>
            )}
          </div>

          {/* Note list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {notes.length === 0 && (
              <div className="text-center py-8 text-sm" style={{ color: '#9c8c6e' }}>
                {tab === 'term' ? '용어가 없습니다' : tab === 'expression' ? '저장된 표현이 없습니다' : '틀린 문장이 없습니다'}
              </div>
            )}
            {notes.map(note => (
              <div key={note.id} className="group relative p-3 rounded-xl border" style={{ borderColor: '#e0d8cc', background: '#faf8f4' }}>
                {editingId === note.id ? (
                  /* ── inline edit form ─────────────────────────────────── */
                  <div className="space-y-2">
                    <input
                      placeholder={tab === 'term' ? '용어' : tab === 'expression' ? '표현 (영어)' : '문장'}
                      value={editForm.content}
                      onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                      style={{ borderColor: '#c8b88a', background: 'white' }}
                    />
                    {tab !== 'mistake' && (
                      <input
                        placeholder="한국어 번역"
                        value={editForm.translation}
                        onChange={e => setEditForm(f => ({ ...f, translation: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                        style={{ borderColor: '#c8b88a', background: 'white' }}
                      />
                    )}
                    <input
                      placeholder="상황/태그"
                      value={editForm.tag}
                      onChange={e => setEditForm(f => ({ ...f, tag: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                      style={{ borderColor: '#c8b88a', background: 'white' }}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(note)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#8a6530' }}>저장</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#9c8c6e' }}>취소</button>
                    </div>
                  </div>
                ) : (
                  /* ── display ──────────────────────────────────────────── */
                  <>
                    <div className="flex items-start justify-between gap-2 pr-12">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm" style={{ color: '#1a1208' }}>{note.content}</div>
                        {note.translation && (
                          <div className="text-xs mt-0.5" style={{ color: '#6b5c3e' }}>{note.translation}</div>
                        )}
                        {note.context && (
                          <div className="text-xs mt-1 italic" style={{ color: '#9c8c6e' }}>{note.context}</div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {note.tag && (
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#f2efe9', color: '#6b5c3e' }}>{note.tag}</span>
                          )}
                          <span className="text-xs px-1.5 py-0.5 rounded" style={tagColor(note.source)}>
                            {note.source === 'auto' ? '자동저장' : '직접추가'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* hover action buttons */}
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-xs p-1 rounded-md hover:bg-amber-50 transition-colors"
                        title="편집"
                        style={{ color: '#8a6530' }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'DELETE_WORK_NOTE', id: note.id })}
                        className="text-xs p-1 rounded-md hover:bg-red-50 transition-colors"
                        style={{ color: '#9c8c6e' }}
                      >
                        ✕
                      </button>
                    </div>

                    {tab === 'mistake' && (
                      <button className="mt-2 text-xs px-2 py-1 rounded-lg border" style={{ borderColor: '#c8b88a', color: '#8a6530' }}>
                        다시 연습 →
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

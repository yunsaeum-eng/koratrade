'use client'

import { useEffect, useState, useRef } from 'react'
import { useGame } from '@/contexts/GameContext'
import { GLOSSARY_SORTED } from '@/data/termGlossary'

const GUIDELINES: Record<string, { ko: string[]; en: string[] }> = {
  brand_profile: {
    ko: [
      'KoraTrade의 주요 수출 시장과 비중을 파악하세요',
      '주력 제품 라인과 가격대를 확인하세요',
      '룰루레몬 대비 KoraTrade의 차별점을 3가지 찾으세요',
      '읽고 나면 Sarah에게 이메일로 보고해야 해요!',
    ],
    en: [
      "Identify KoraTrade's main export markets and their percentages",
      'Note the core product lineup and price ranges',
      'Find 3 key differentiators vs. Lululemon',
      "After reading, you'll need to submit a report email to Sarah!",
    ],
  },
  org_chart: {
    ko: ['각 팀원의 역할과 담당 업무를 파악하세요', '내가 속한 팀의 구조를 이해하세요'],
    en: ["Learn each team member's role and responsibilities", 'Understand the team structure you belong to'],
  },
  email_guide: {
    ko: ['이메일의 5가지 구성요소를 파악하세요', '좋은 이메일과 나쁜 이메일의 차이를 이해하세요', '예시를 참고해서 보고 이메일을 작성해야 해요'],
    en: ['Learn the 5 components of a business email', 'Understand the difference between good and bad emails', "You'll use this guide to write your report email"],
  },
}

interface Props {
  docType: string
  docName: string
  lang: string
  onClose: () => void
}

// Inject tooltip highlights into raw document HTML for known glossary terms
function injectTermHighlights(rawHtml: string, lang: string): string {
  let result = rawHtml
  // Process longest terms first to avoid partial matches
  for (const term of GLOSSARY_SORTED) {
    for (const pattern of term.patterns) {
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const desc = lang === 'ko' ? term.desc.ko : term.desc.en
      // Only match inside text nodes (not inside HTML tags/attributes)
      const rx = new RegExp(`(?<![<a-zA-Z"'])${escaped}(?![a-zA-Z"'>])`, 'g')
      result = result.replace(
        rx,
        `<span style="border-bottom:1.5px dashed #8a6530;cursor:help" title="${desc}">${pattern}</span>`
      )
    }
  }
  return result
}

export default function DocumentViewer({ docType, docName, lang, onClose }: Props) {
  const { dispatch } = useGame()
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const guidelines = GUIDELINES[docType]
  const [guideChecked, setGuideChecked] = useState<boolean[]>(
    () => guidelines ? new Array(guidelines.ko.length).fill(false) : []
  )
  const [guideDismissed, setGuideDismissed] = useState(false)
  const docRef = useRef<HTMLDivElement>(null)

  const shouldShowGuide = guidelines && !guideDismissed

  useEffect(() => {
    if (shouldShowGuide) return
    setLoading(true)
    fetch('/api/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType, lang }),
    })
      .then(r => r.json())
      .then(data => { setHtml(injectTermHighlights(data.html ?? '', lang)); setLoading(false) })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType, lang, guideDismissed])

  const handleSaveToNotes = () => {
    dispatch({
      type: 'ADD_WORK_NOTE',
      note: {
        id: `doc-${docType}-${Date.now()}`,
        type: 'memo',
        content: `${lang === 'ko' ? '[문서]' : '[Document]'} ${docName}`,
        context: `${docType} ${lang === 'ko' ? '문서 참조' : 'document reference'}`,
        addedAt: new Date().toISOString(),
        source: 'auto',
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,18,8,0.6)' }}>
      <div className="w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ background: 'white', maxHeight: '88vh' }}>
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{ background: '#faf8f4', borderColor: '#e0d8cc' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: '#faf5ec' }}>📄</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: '#1a1208' }}>{docName}</div>
            <div className="text-xs" style={{ color: '#9c8c6e' }}>KoraTrade Inc.</div>
          </div>
          <button
            onClick={handleSaveToNotes}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex-shrink-0"
            style={{ background: saved ? '#256040' : '#f2efe9', color: saved ? 'white' : '#8a6530' }}
          >
            {saved ? (lang === 'ko' ? '✓ 저장됨' : '✓ Saved') : (lang === 'ko' ? '업무 노트에 저장' : 'Save to Notes')}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-gray-100 flex-shrink-0"
            style={{ color: '#9c8c6e' }}
          >
            ✕
          </button>
        </div>

        {/* Pre-read guideline popup */}
        {shouldShowGuide && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="text-sm font-semibold" style={{ color: '#8a6530' }}>
              {lang === 'ko' ? '📋 읽기 전 체크리스트' : '📋 Before You Read'}
            </div>
            <div className="text-xs" style={{ color: '#6b5c3e' }}>
              {lang === 'ko' ? '다음 항목들을 염두에 두고 문서를 읽으세요:' : 'Keep these points in mind as you read:'}
            </div>
            <div className="flex flex-col gap-2">
              {(lang === 'ko' ? guidelines.ko : guidelines.en).map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl" style={{ background: guideChecked[i] ? '#edf7f1' : '#faf5ec', border: `1px solid ${guideChecked[i] ? '#b8e0c8' : '#e8d8b8'}` }}>
                  <input type="checkbox" checked={guideChecked[i]}
                    onChange={() => setGuideChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                    className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed" style={{ color: guideChecked[i] ? '#256040' : '#4a3a28' }}>{item}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setGuideDismissed(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
              style={{ background: '#8a6530', color: 'white' }}>
              {lang === 'ko' ? '문서 열기' : 'Open Document'}
            </button>
          </div>
        )}

        {/* Document content */}
        {!shouldShowGuide && (
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#8a6530', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div className="text-sm" style={{ color: '#9c8c6e' }}>{lang === 'ko' ? '문서를 생성하는 중...' : 'Generating document...'}</div>
              </div>
            ) : html ? (
              <div
                ref={docRef}
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ lineHeight: 1.6 }}
              />
            ) : (
              <div className="text-center py-8 text-sm" style={{ color: '#9c8c6e' }}>{lang === 'ko' ? '문서를 불러오지 못했습니다.' : 'Could not load the document.'}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

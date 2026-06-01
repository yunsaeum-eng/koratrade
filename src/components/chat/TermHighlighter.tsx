'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { GLOSSARY_SORTED, GlossaryTerm } from '@/data/termGlossary'

interface TooltipState {
  term: GlossaryTerm
  rect: DOMRect
}

interface Props {
  text: string
  episodeNum: number
  lang: string
}

// Split text into segments, marking which are glossary terms
function parseSegments(
  text: string,
  episodeNum: number,
): Array<{ type: 'text'; value: string } | { type: 'term'; value: string; term: GlossaryTerm }> {
  const activeTerms = GLOSSARY_SORTED.filter(t => episodeNum <= t.episodeMax)
  if (activeTerms.length === 0) return [{ type: 'text', value: text }]

  // Build one big regex alternating all patterns (longest first = GLOSSARY_SORTED order)
  const allPatterns = activeTerms.flatMap(t => t.patterns)
    .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${allPatterns.join('|')})`, 'gi')

  const parts = text.split(regex)
  const result: ReturnType<typeof parseSegments> = []

  for (const part of parts) {
    if (!part) continue
    const matchedTerm = activeTerms.find(t =>
      t.patterns.some(p => p.toLowerCase() === part.toLowerCase())
    )
    if (matchedTerm) {
      result.push({ type: 'term', value: part, term: matchedTerm })
    } else {
      result.push({ type: 'text', value: part })
    }
  }
  return result
}

export default function TermHighlighter({ text, episodeNum, lang }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  // Dismiss tooltip on click outside
  useEffect(() => {
    if (!tooltip) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTooltip(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [tooltip])

  // Dismiss on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setTooltip(null) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const segments = parseSegments(text, episodeNum)

  const nodes: ReactNode[] = segments.map((seg, i) => {
    if (seg.type === 'text') return seg.value

    const { term } = seg
    const isActive = tooltip?.term.id === term.id

    return (
      <span
        key={i}
        className="cursor-help border-b border-dashed"
        style={{
          borderColor: '#8a6530',
          color: isActive ? '#8a6530' : 'inherit',
          fontWeight: isActive ? 600 : 'inherit',
        }}
        onClick={e => {
          e.stopPropagation()
          const rect = (e.target as HTMLElement).getBoundingClientRect()
          setTooltip(isActive ? null : { term, rect })
        }}
      >
        {seg.value}
      </span>
    )
  })

  return (
    <span ref={containerRef} className="relative">
      {nodes}

      {tooltip && (() => {
        const desc = lang === 'ko' ? tooltip.term.desc.ko : tooltip.term.desc.en
        // Position tooltip: prefer above the term
        const spaceAbove = tooltip.rect.top
        const above = spaceAbove > 80

        return (
          <span
            className="fixed z-50 rounded-xl shadow-xl border text-xs px-3 py-2 max-w-xs leading-relaxed pointer-events-none"
            style={{
              left: Math.min(tooltip.rect.left, window.innerWidth - 260),
              top: above ? tooltip.rect.top - 8 : tooltip.rect.bottom + 8,
              transform: above ? 'translateY(-100%)' : 'none',
              background: 'white',
              borderColor: '#e0d8cc',
              color: '#1a1208',
              width: 240,
            }}
          >
            <span className="font-semibold block mb-0.5" style={{ color: '#8a6530' }}>
              {tooltip.term.patterns[0]}
            </span>
            {desc}
          </span>
        )
      })()}
    </span>
  )
}

'use client'

import { CHARACTER_IMAGES } from '@/config/characters'

type CharKey = keyof typeof CHARACTER_IMAGES

export const NPC_FULL: Record<string, string> = Object.fromEntries(
  (Object.keys(CHARACTER_IMAGES) as CharKey[]).map(k => [k, CHARACTER_IMAGES[k].full])
)
export const NPC_CROP: Record<string, string> = Object.fromEntries(
  (Object.keys(CHARACTER_IMAGES) as CharKey[]).map(k => [k, CHARACTER_IMAGES[k].crop])
)
export const NPC_IMAGES = NPC_CROP
export const NPC_COLORS: Record<string, { bg: string; border: string }> = Object.fromEntries(
  (Object.keys(CHARACTER_IMAGES) as CharKey[]).map(k => [k, { bg: CHARACTER_IMAGES[k].bg, border: CHARACTER_IMAGES[k].accent }])
)

interface Props {
  src: string
  alt: string
  variant: 'small' | 'medium' | 'large'
  size?: number
  height?: number
  bg?: string
  border?: string
  className?: string
}

export default function CharacterAvatar({ src, alt, variant, size = 36, height, bg, border, className = '' }: Props) {
  if (variant === 'large') {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ width: '100%', height: 'auto', imageRendering: 'pixelated', display: 'block' }}
      />
    )
  }

  if (variant === 'medium') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: height ?? size,
          borderRadius: 8,
          overflow: 'hidden',
          flexShrink: 0,
          border: `2px solid ${border ?? 'rgba(138,101,48,0.2)'}`,
          background: bg ?? '#f2efe9',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 10%',
            imageRendering: 'pixelated',
            display: 'block',
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: `2px solid ${border ?? 'rgba(138,101,48,0.3)'}`,
        background: bg ?? '#f2efe9',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 15%',
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>
  )
}

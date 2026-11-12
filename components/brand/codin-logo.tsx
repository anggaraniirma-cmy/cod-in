'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Cod'in brand logo.
 *
 * Source asset (supplied by the user):
 *   public/codin-logo.jpeg — a 1254×1254 square JPEG containing the full
 *   "Cod'in" lockup (cart-shaped "C" + wordmark) in blue on a near-white
 *   background, with generous whitespace padding around the artwork.
 *
 * Because the source is a padded square, a plain <img> would render the mark
 * tiny and off-centre. The artwork's exact content box is therefore cropped
 * with CSS so the visible logo fills the element cleanly. The original file
 * is never modified.
 *
 *   CodinLogo — full lockup (icon + wordmark) for the top nav / brand area.
 *   CodinMark — icon-only crop for compact spots (AI panel).
 */

const LOGO_SRC = '/codin-logo.jpeg'

// Measured boxes inside the 1254×1254 source image.
const SRC = 1254
const FULL = { x: 167, y: 273, w: 977, h: 687 } // icon + wordmark
const ICON = { x: 167, y: 269, w: 539, h: 695 } // cart "C" only

/** Neutral text lockup — only shown if the real asset fails to load. */
function FallbackWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-lg font-bold text-white">
        C
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-ink">
          Cod&apos;in<span className="text-brand-600">.</span>
        </span>
      )}
    </span>
  )
}

/**
 * The supplied logo, cropped to `box` and rendered at `height` px.
 * Uses a ref + effect so it still resolves when the image is already cached
 * (in which case React's onLoad may never fire).
 */
function LogoImage({
  box,
  height,
  className,
}: {
  box: { x: number; y: number; w: number; h: number }
  height: number
  className?: string
}) {
  const ref = useRef<HTMLImageElement>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    const img = ref.current
    if (!img) return
    if (img.complete) {
      setStatus(img.naturalWidth > 0 ? 'ok' : 'error')
    }
  }, [])

  if (status === 'error') return <FallbackWordmark />

  const boxW = height * (box.w / box.h)
  const scale = boxW / box.w // rendered px per source px

  return (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden',
        status === 'ok' ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ width: boxW, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={LOGO_SRC}
        alt="Cod'in"
        onLoad={() => setStatus('ok')}
        onError={() => setStatus('error')}
        className="absolute max-w-none"
        style={{
          width: SRC * scale,
          height: SRC * scale,
          left: -box.x * scale,
          top: -box.y * scale,
        }}
      />
    </span>
  )
}

/** Full brand lockup (icon + wordmark) for headers and the brand area. */
export function CodinLogo({
  className,
  height = 38,
  subtitle,
}: {
  className?: string
  height?: number
  subtitle?: string
}) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <LogoImage box={FULL} height={height} />
      {subtitle && (
        <span className="hidden truncate border-l border-line pl-3 text-sm text-ink-muted sm:block">
          {subtitle}
        </span>
      )}
    </div>
  )
}

/** Icon-only crop (the cart "C") for compact spots. */
export function CodinMark({
  className,
  height = 28,
}: {
  className?: string
  height?: number
}) {
  return <LogoImage box={ICON} height={height} className={className} />
}

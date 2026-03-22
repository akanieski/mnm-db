import { useState, useEffect, useRef } from 'react'
import { Package } from 'lucide-react'
import iconMap from '../icon_map.json'

const ICON_MAP = iconMap as Record<string, string>

interface IconColors {
  primary: [number, number, number]
  secondary: [number, number, number]
  tertiary: [number, number, number]
  postSaturation: number
}

function parseIconId(raw: string): { filename: string; colors: IconColors | null } {
  const parts = raw.split(':')
  const baseId = parts[0]
  const filename = ICON_MAP[baseId] ?? baseId

  // Format: iconHID:RRGGBB:RRGGBB:RRGGBB:overlayIntensity:hasPropsInStr:origSat:postSat
  if (parts.length < 4) return { filename, colors: null }

  const hexToRgb = (h: string): [number, number, number] => [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]

  const primary   = hexToRgb(parts[1])
  const secondary = hexToRgb(parts[2])
  const tertiary  = hexToRgb(parts[3])

  // If all channels are white (1,1,1) no tinting needed
  const isWhite = (c: [number, number, number]) => c[0] > 0.97 && c[1] > 0.97 && c[2] > 0.97
  if (isWhite(primary) && isWhite(secondary) && isWhite(tertiary)) return { filename, colors: null }

  const postSaturation = parts.length >= 8 ? parseFloat(parts[7]) || 1.0 : 1.0

  return { filename, colors: { primary, secondary, tertiary, postSaturation } }
}

function applyChannelTint(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  size: number,
  colors: IconColors
) {
  ctx.drawImage(img, 0, 0, size, size)
  const data = ctx.getImageData(0, 0, size, size)
  const px = data.data
  const { primary: p, secondary: s, tertiary: t } = colors

  const postSat = colors.postSaturation

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i]     / 255
    const g = px[i + 1] / 255
    const b = px[i + 2] / 255

    // Sprite channels: R=secondary material (gem/highlights), G=primary metal, B=tertiary accent
    let outR = (r * s[0] + g * p[0] + b * t[0]) * 255
    let outG = (r * s[1] + g * p[1] + b * t[1]) * 255
    let outB = (r * s[2] + g * p[2] + b * t[2]) * 255

    // Apply post-saturation boost
    if (postSat !== 1.0) {
      const lum = outR * 0.299 + outG * 0.587 + outB * 0.114
      outR = lum + (outR - lum) * postSat
      outG = lum + (outG - lum) * postSat
      outB = lum + (outB - lum) * postSat
    }

    px[i]     = Math.max(0, Math.min(255, outR))
    px[i + 1] = Math.max(0, Math.min(255, outG))
    px[i + 2] = Math.max(0, Math.min(255, outB))
    // alpha unchanged
  }
  ctx.putImageData(data, 0, 0)
}

interface ItemIconProps {
  hid: string
  iconId?: string | null
  size?: number
  className?: string
}

export function ItemIcon({ hid, iconId, size = 40, className = '' }: ItemIconProps) {
  const [errored, setErrored] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { filename, colors } = parseIconId(iconId || hid)
  const src = `/icons/${filename}.png`

  useEffect(() => {
    if (!colors || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => applyChannelTint(ctx, img, size, colors)
    img.onerror = () => setErrored(true)
    img.src = src
  }, [src, colors, size])

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded bg-muted text-muted-foreground/30 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Package style={{ width: size * 0.5, height: size * 0.5 }} />
      </div>
    )
  }

  if (colors) {
    return (
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={`rounded object-contain shrink-0 ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={hid}
      width={size}
      height={size}
      className={`rounded object-contain shrink-0 ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      onError={() => setErrored(true)}
    />
  )
}


import { useState } from 'react'
import { formatDateShort } from './dateUtils'
import type { BodyMetricRow } from './api'

const WIDTH = 320
const HEIGHT = 130
const PAD_X = 12
const PAD_Y = 18

export function WeightChart({ metrics }: { metrics: BodyMetricRow[] }) {
  const [active, setActive] = useState<number | null>(null)
  const points = metrics.filter((m) => m.weight_kg != null)

  if (points.length === 0) {
    return <p className="text-sm text-stone-500 dark:text-stone-400">Nenhum registro de peso ainda.</p>
  }

  const weights = points.map((p) => p.weight_kg!)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const range = max - min || 1
  const stepX = points.length > 1 ? (WIDTH - PAD_X * 2) / (points.length - 1) : 0

  const xy = points.map((p, i) => ({
    x: PAD_X + i * stepX,
    y: PAD_Y + (HEIGHT - PAD_Y * 2) * (1 - (p.weight_kg! - min) / range),
    point: p,
  }))
  const path = xy.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full touch-manipulation" role="img" aria-label="Evolução do peso">
        <path d={path} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {xy.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={5}
            className="cursor-pointer fill-amber-500 stroke-white dark:stroke-stone-900"
            strokeWidth="1.5"
            onClick={() => setActive(active === i ? null : i)}
          />
        ))}
      </svg>

      {active !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-lg bg-stone-900 px-2 py-1 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-stone-900"
          style={{ left: `${(xy[active].x / WIDTH) * 100}%`, top: `${(xy[active].y / HEIGHT) * 100}%` }}
        >
          {formatDateShort(xy[active].point.date)} · {xy[active].point.weight_kg} kg
        </div>
      )}

      <div className="mt-1 flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
        <span>{points[0].weight_kg} kg</span>
        {points.length > 1 && <span>{points[points.length - 1].weight_kg} kg</span>}
      </div>
    </div>
  )
}

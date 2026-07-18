import { formatDateShort, formatMinutes } from './dateUtils'
import type { FinishedSession } from './api'

function effectiveMs(s: FinishedSession): number {
  return new Date(s.finished_at).getTime() - new Date(s.started_at).getTime() - s.paused_ms
}

export function DurationList({ sessions }: { sessions: FinishedSession[] }) {
  const recent = sessions.slice(0, 8)
  if (recent.length === 0) {
    return <p className="text-sm text-stone-500 dark:text-stone-400">Nenhum treino concluído ainda.</p>
  }
  const max = Math.max(...recent.map(effectiveMs), 1)

  return (
    <div className="flex flex-col gap-3">
      {recent.map((s) => {
        const eff = effectiveMs(s)
        const pausedMin = Math.round(s.paused_ms / 60000)
        const pct = Math.max(6, Math.round((eff / max) * 100))
        return (
          <div key={s.id}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
              <span className="truncate text-stone-500 dark:text-stone-400">
                {formatDateShort(s.started_at)} · {s.day_name}
              </span>
              <span className="shrink-0 font-semibold">
                {formatMinutes(eff)}
                {pausedMin > 0 && <span className="font-normal text-stone-400 dark:text-stone-500"> (+{pausedMin} min pausa)</span>}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800">
              <div className="h-2 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useState } from 'react'
import { toDateStr } from './dateUtils'

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function MonthHeatmap({ trainedDates }: { trainedDates: Set<string> }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = toDateStr(new Date())
  const rawLabel = cursor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const monthLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)

  const cells: (string | null)[] = [...Array(startWeekday).fill(null)]
  for (let d = 1; d <= daysInMonth; d++) cells.push(toDateStr(new Date(year, month, d)))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Mês anterior"
          className="flex size-7 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          ‹
        </button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Próximo mês"
          className="flex size-7 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={i} className="text-center text-[10px] font-medium text-stone-400 dark:text-stone-600">
            {w}
          </span>
        ))}
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={i} />
          const trained = trainedDates.has(dateStr)
          const isToday = dateStr === todayStr
          const dayNum = Number(dateStr.slice(8, 10))
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                trained
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-600'
              } ${isToday ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-white dark:ring-offset-stone-900' : ''}`}
            >
              {trained ? '✓' : dayNum}
            </div>
          )
        })}
      </div>
    </div>
  )
}

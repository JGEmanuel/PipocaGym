import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'
import { fetchBodyMetrics, fetchFinishedSessions } from '../features/progress/api'
import { computeStreak, computeTrainedDates, countWithinDays, formatMinutes } from '../features/progress/dateUtils'
import { MonthHeatmap } from '../features/progress/MonthHeatmap'
import { DurationList } from '../features/progress/DurationList'
import { WeightChart } from '../features/progress/WeightChart'
import { MetricEntryForm } from '../features/progress/MetricEntryForm'

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3 text-center dark:border-stone-800 dark:bg-stone-900">
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] leading-tight text-stone-500 dark:text-stone-400">{label}</p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <h2 className="mb-3 text-sm font-bold">{title}</h2>
      {children}
    </section>
  )
}

export function Progress() {
  const queryClient = useQueryClient()
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at')
      if (error) throw error
      return data as Profile[]
    },
  })

  const [profileId, setProfileId] = useState<string | null>(null)
  const activeId = profileId ?? profiles?.[0]?.id ?? null

  const { data: sessions } = useQuery({
    queryKey: ['finished-sessions', activeId],
    queryFn: () => fetchFinishedSessions(activeId!),
    enabled: Boolean(activeId),
  })

  const { data: metrics } = useQuery({
    queryKey: ['body-metrics', activeId],
    queryFn: () => fetchBodyMetrics(activeId!),
    enabled: Boolean(activeId),
  })

  const trainedDates = computeTrainedDates(sessions ?? [])
  const streak = computeStreak(trainedDates)
  const last7 = countWithinDays(trainedDates, 7)
  const last30 = countWithinDays(trainedDates, 30)

  const avgDurationLabel = (() => {
    if (!sessions || sessions.length === 0) return '—'
    const recent = sessions.slice(0, 8)
    const avgMs =
      recent.reduce((sum, s) => sum + (new Date(s.finished_at).getTime() - new Date(s.started_at).getTime() - s.paused_ms), 0) /
      recent.length
    return formatMinutes(avgMs)
  })()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pb-10 pt-4">
      <PageHeader back="/" title="Progresso" />

      <div className="flex gap-2">
        {profiles?.map((p) => (
          <button
            key={p.id}
            onClick={() => setProfileId(p.id)}
            className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeId === p.id
                ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-stone-300 text-stone-500 hover:border-stone-400 dark:border-stone-700 dark:text-stone-400'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatTile label="sequência atual" value={`${streak}d`} />
        <StatTile label="últimos 7 dias" value={String(last7)} />
        <StatTile label="últimos 30 dias" value={String(last30)} />
        <StatTile label="duração média" value={avgDurationLabel} />
      </div>

      <Card title="Frequência">
        <MonthHeatmap trainedDates={trainedDates} />
      </Card>

      <Card title="Tempo de treino">
        <DurationList sessions={sessions ?? []} />
      </Card>

      <Card title="Peso corporal">
        <WeightChart metrics={metrics ?? []} />
      </Card>

      <Card title="Registrar peso e medidas">
        {activeId && (
          <MetricEntryForm
            profileId={activeId}
            metrics={metrics ?? []}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ['body-metrics', activeId] })}
          />
        )}
      </Card>
    </div>
  )
}

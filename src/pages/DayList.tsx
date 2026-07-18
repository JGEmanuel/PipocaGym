import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { fetchDays, fetchPhaseName } from '../features/workout/api'

export function DayList() {
  const { profileId = '', planId = '', phaseId = '' } = useParams()

  const { data: phaseName } = useQuery({
    queryKey: ['phase-name', phaseId],
    queryFn: () => fetchPhaseName(phaseId),
    enabled: Boolean(phaseId),
  })

  const { data: days, isLoading } = useQuery({
    queryKey: ['days', phaseId],
    queryFn: () => fetchDays(phaseId),
    enabled: Boolean(phaseId),
  })

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-4">
      <PageHeader back={`/planos/${profileId}/${planId}`} title="Dias de treino" subtitle={phaseName} />

      <div className="mt-6 flex flex-col gap-3">
        {isLoading && <div className="h-16 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />}

        {days?.map((day) => (
          <Link
            key={day.id}
            to={`/planos/${profileId}/${planId}/${phaseId}/${day.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-transform active:scale-[0.98] dark:border-stone-800 dark:bg-stone-900"
          >
            <span className="font-semibold">{day.name}</span>
            <svg className="size-5 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { fetchPhases, fetchPlanTitle } from '../features/workout/api'

export function PhaseList() {
  const { profileId = '', planId = '' } = useParams()

  const { data: title } = useQuery({
    queryKey: ['plan-title', planId],
    queryFn: () => fetchPlanTitle(planId),
    enabled: Boolean(planId),
  })

  const { data: phases, isLoading } = useQuery({
    queryKey: ['phases', planId],
    queryFn: () => fetchPhases(planId),
    enabled: Boolean(planId),
  })

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-4">
      <PageHeader back={`/planos/${profileId}`} title="Fases" subtitle={title} />

      <div className="mt-6 flex flex-col gap-3">
        {isLoading && <div className="h-16 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />}

        {phases?.map((phase) => (
          <Link
            key={phase.id}
            to={`/planos/${profileId}/${planId}/${phase.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-transform active:scale-[0.98] dark:border-stone-800 dark:bg-stone-900"
          >
            <span className="font-semibold">{phase.name}</span>
            <svg className="size-5 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

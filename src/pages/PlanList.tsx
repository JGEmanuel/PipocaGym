import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import { fetchActivePlans } from '../features/plans/api'
import type { Profile } from '../lib/types'

export function PlanList() {
  const { profileId = '' } = useParams()

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at')
      if (error) throw error
      return data as Profile[]
    },
  })
  const profile = profiles?.find((p) => p.id === profileId)

  const { data: plans, isLoading } = useQuery({
    queryKey: ['active-plans', profileId],
    queryFn: () => fetchActivePlans(profileId),
    enabled: Boolean(profileId),
  })

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-4">
      <PageHeader back="/" title={profile ? `Treinos de ${profile.name}` : 'Treinos'} />

      <div className="mt-6 flex flex-col gap-3">
        {isLoading && <div className="h-20 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />}

        {plans?.map((plan) => (
          <Link
            key={plan.id}
            to={`/planos/${profileId}/${plan.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-transform active:scale-[0.98] dark:border-stone-800 dark:bg-stone-900"
          >
            <span className="font-semibold">{plan.title}</span>
            <svg className="size-5 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}

        {plans?.length === 0 && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Nenhum treino ativo. Envie um plano na{' '}
            <Link to="/gestao" className="font-semibold text-amber-600 dark:text-amber-400">
              tela de gestão
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}

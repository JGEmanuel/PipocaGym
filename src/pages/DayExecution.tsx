import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { fetchDayBlocks, fetchDayName, fetchOpenSession } from '../features/workout/api'
import { GuideModal, type SelectedGuide } from '../features/workout/GuideModal'
import { SessionBar } from '../features/workout/SessionBar'
import type { DayItem, SessionRow } from '../features/workout/types'

const BLOCK_LABEL: Record<string, { icon: string; label: string }> = {
  aquecimento: { icon: '🔥', label: 'Aquecimento' },
  principal: { icon: '💪', label: 'Bloco Principal' },
  cardio: { icon: '❤️', label: 'Cardio' },
  alongamento: { icon: '🧘', label: 'Alongamento' },
}

export function DayExecution() {
  const { profileId = '', planId = '', phaseId = '', dayId = '' } = useParams()
  const [selectedGuide, setSelectedGuide] = useState<SelectedGuide | null>(null)
  const [session, setSession] = useState<SessionRow | null | undefined>(undefined)

  const { data: dayName } = useQuery({
    queryKey: ['day-name', dayId],
    queryFn: () => fetchDayName(dayId),
    enabled: Boolean(dayId),
  })

  const { data: blocks, isLoading } = useQuery({
    queryKey: ['day-blocks', dayId],
    queryFn: () => fetchDayBlocks(dayId),
    enabled: Boolean(dayId),
  })

  const { data: initialSession } = useQuery({
    queryKey: ['open-session', profileId, dayId],
    queryFn: () => fetchOpenSession(profileId, dayId),
    enabled: Boolean(profileId && dayId),
  })

  useEffect(() => {
    if (initialSession !== undefined) setSession(initialSession)
  }, [initialSession])

  function openGuide(item: DayItem) {
    if (!item.guides) return
    setSelectedGuide({ dayItemName: item.name, guideName: item.guides.name, bodyMd: item.guides.body_md })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-4">
      <PageHeader back={`/planos/${profileId}/${planId}/${phaseId}`} title={dayName ?? 'Treino'} />

      <div className="mt-4">
        <SessionBar profileId={profileId} dayId={dayId} session={session ?? null} onChange={setSession} />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          <div className="h-32 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
          <div className="h-32 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {blocks?.map((block) => {
          const meta = BLOCK_LABEL[block.kind] ?? { icon: '•', label: block.title }
          return (
            <section key={block.id} className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <span>{meta.icon}</span>
                <span>{block.title}</span>
              </h2>
              <div className="mt-2 flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
                {block.plan_items.map((item) => {
                  const hasGuide = Boolean(item.guides)
                  return (
                    <button
                      key={item.id}
                      onClick={() => openGuide(item)}
                      disabled={!hasGuide}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2.5 text-left transition-colors ${
                        hasGuide ? 'hover:bg-stone-100 active:scale-[0.99] dark:hover:bg-stone-800' : 'cursor-default'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{item.name}</span>
                        {item.hint && (
                          <span className="block truncate text-xs text-stone-500 dark:text-stone-400">{item.hint}</span>
                        )}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        {item.prescription && (
                          <span className="whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold dark:bg-stone-800">
                            {item.prescription}
                          </span>
                        )}
                        {hasGuide && (
                          <svg className="size-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <GuideModal item={selectedGuide} onClose={() => setSelectedGuide(null)} />
    </div>
  )
}

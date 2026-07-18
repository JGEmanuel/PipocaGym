import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '../../components/PageHeader'
import { supabase } from '../../lib/supabase'
import { parseWorkoutMarkdown } from '../../lib/markdownPlanParser'
import { normalize } from '../../lib/textNormalize'
import type { GuideAliasRow } from '../../lib/guideLinking'
import type { ParsedPlan, Profile } from '../../lib/types'
import { buildResolutionPlan, type ReviewEntry } from './reviewLinking'
import { fetchGuideAliases, fetchPlans, saveAliases, savePlan, setPlanActive, type PlanRow } from './api'

export function UploadPlanPage() {
  const queryClient = useQueryClient()
  const [profileId, setProfileId] = useState<string | null>(null)

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at')
      if (error) throw error
      return data as Profile[]
    },
  })

  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ['plans', profileId],
    queryFn: () => fetchPlans(profileId!),
    enabled: Boolean(profileId),
  })

  const toggleActive = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) => setPlanActive(vars.id, vars.active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', profileId] }),
  })

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-4">
      <PageHeader back="/" title="Gestão de treinos" />

      <div className="mt-6 flex gap-2">
        {profiles?.map((p) => (
          <button
            key={p.id}
            onClick={() => setProfileId(p.id)}
            className={`flex-1 rounded-2xl border px-4 py-3 font-semibold transition-colors ${
              profileId === p.id
                ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-stone-300 text-stone-500 hover:border-stone-400 dark:border-stone-700 dark:text-stone-400'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {profileId && (
        <>
          <UploadSection profileId={profileId} onSaved={() => queryClient.invalidateQueries({ queryKey: ['plans', profileId] })} />

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Treinos cadastrados
            </h2>
            {loadingPlans && <p className="mt-3 text-sm text-stone-500">Carregando…</p>}
            <ul className="mt-3 flex flex-col gap-2">
              {plans?.map((plan) => (
                <PlanRowItem key={plan.id} plan={plan} onToggle={(active) => toggleActive.mutate({ id: plan.id, active })} />
              ))}
              {plans?.length === 0 && (
                <p className="text-sm text-stone-500 dark:text-stone-400">Nenhum treino carregado ainda.</p>
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}

function PlanRowItem({ plan, onToggle }: { plan: PlanRow; onToggle: (active: boolean) => void }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{plan.title}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {new Date(plan.created_at).toLocaleDateString('pt-BR')} · {plan.active ? 'Ativo' : 'Inativo'}
        </p>
      </div>
      <button
        onClick={() => onToggle(!plan.active)}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          plan.active
            ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400'
            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
        }`}
      >
        {plan.active ? 'Inativar' : 'Reativar'}
      </button>
    </li>
  )
}

function UploadSection({ profileId, onSaved }: { profileId: string; onSaved: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawMd, setRawMd] = useState<string | null>(null)
  const [plan, setPlan] = useState<ParsedPlan | null>(null)
  const [userDecisions, setUserDecisions] = useState<Map<string, number | null>>(new Map())
  const [saveProgress, setSaveProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { data: aliases } = useQuery({
    queryKey: ['guide_aliases'],
    queryFn: fetchGuideAliases,
  })

  const resolutionPlan = useMemo(() => {
    if (!plan || !aliases) return null
    return buildResolutionPlan(plan, aliases)
  }, [plan, aliases])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setFileName(file.name)
    setRawMd(text)
    setPlan(parseWorkoutMarkdown(text))
    setUserDecisions(new Map())
    setError(null)
    setSuccess(false)
  }

  function decide(key: string, value: number | null) {
    setUserDecisions((prev) => {
      const next = new Map(prev)
      next.set(key, value)
      return next
    })
  }

  const pendingCount = resolutionPlan
    ? resolutionPlan.reviewQueue.filter((e) => !userDecisions.has(e.key)).length
    : 0

  const totalItems = plan
    ? plan.phases.reduce(
        (acc, ph) => acc + ph.days.reduce((a2, d) => a2 + d.blocks.reduce((a3, b) => a3 + b.items.length, 0), 0),
        0,
      )
    : 0

  async function handleSave() {
    if (!plan || !rawMd || !resolutionPlan) return
    setError(null)
    setSaveProgress({ done: 0, total: 1 })
    try {
      const finalResolutions = new Map(resolutionPlan.resolutions)
      for (const [key, value] of userDecisions) finalResolutions.set(key, value)

      await savePlan(profileId, rawMd, plan, finalResolutions, setSaveProgress)

      const aliasesToSave: GuideAliasRow[] = []
      for (const [key, value] of userDecisions) {
        if (value !== null) {
          aliasesToSave.push({ alias_norm: key, guide_name_norm: normalize(plan.guides[value].name) })
        }
      }
      await saveAliases(aliasesToSave)

      setSuccess(true)
      setPlan(null)
      setRawMd(null)
      setFileName(null)
      setUserDecisions(new Map())
      if (fileInputRef.current) fileInputRef.current.value = ''
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar o plano.')
    } finally {
      setSaveProgress(null)
    }
  }

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        Enviar novo treino (.md)
      </h2>

      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 p-6 text-center transition-colors hover:border-amber-500 dark:border-stone-700">
        <span className="text-sm font-medium">{fileName ?? 'Toque para escolher o arquivo'}</span>
        <span className="text-xs text-stone-500 dark:text-stone-400">Formato Markdown (.md)</span>
        <input ref={fileInputRef} type="file" accept=".md,text/markdown" onChange={handleFile} className="hidden" />
      </label>

      {success && (
        <p className="mt-3 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
          Treino salvo com sucesso!
        </p>
      )}
      {error && <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {plan && (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="font-semibold">{plan.title}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            {plan.guides.length} guias de detalhamento · {plan.phases.length} fases ·{' '}
            {plan.phases.reduce((a, ph) => a + ph.days.length, 0)} dias · {totalItems} itens
          </p>
        </div>
      )}

      {resolutionPlan && resolutionPlan.reviewQueue.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">
            Revisão de vínculos ({resolutionPlan.reviewQueue.length - pendingCount}/{resolutionPlan.reviewQueue.length})
          </h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Estes itens não puderam ser ligados automaticamente ao detalhamento. Escolha a guia correspondente ou marque
            "Sem detalhamento".
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {resolutionPlan.reviewQueue.map((entry) => (
              <ReviewRow
                key={entry.key}
                entry={entry}
                guides={plan!.guides}
                decision={userDecisions.get(entry.key)}
                onDecide={(v) => decide(entry.key, v)}
              />
            ))}
          </div>
        </div>
      )}

      {plan && (
        <button
          onClick={handleSave}
          disabled={pendingCount > 0 || saveProgress !== null}
          className="mt-5 w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition-transform hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveProgress
            ? `Salvando… ${saveProgress.done}/${saveProgress.total}`
            : pendingCount > 0
              ? `Resolva ${pendingCount} item(ns) pendente(s)`
              : 'Salvar plano'}
        </button>
      )}
    </section>
  )
}

function ReviewRow({
  entry,
  guides,
  decision,
  onDecide,
}: {
  entry: ReviewEntry
  guides: ParsedPlan['guides']
  decision: number | null | undefined
  onDecide: (value: number | null) => void
}) {
  const [showAll, setShowAll] = useState(entry.candidateIndexes.length === 0)

  return (
    <div className="rounded-2xl border border-stone-200 p-3 dark:border-stone-800">
      <p className="text-sm font-medium">{entry.sampleName}</p>
      <p className="text-xs text-stone-500 dark:text-stone-400">aparece {entry.occurrences}×</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {entry.candidateIndexes.map((idx) => (
          <button
            key={idx}
            onClick={() => onDecide(idx)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              decision === idx
                ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-stone-300 text-stone-600 hover:border-stone-400 dark:border-stone-700 dark:text-stone-300'
            }`}
          >
            {guides[idx].name}
          </button>
        ))}
        <button
          onClick={() => onDecide(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            decision === null
              ? 'border-stone-500 bg-stone-500/10'
              : 'border-stone-300 text-stone-600 hover:border-stone-400 dark:border-stone-700 dark:text-stone-300'
          }`}
        >
          Sem detalhamento
        </button>
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full border border-dashed border-stone-300 px-3 py-1 text-xs text-stone-500 dark:border-stone-700"
          >
            Outro…
          </button>
        )}
      </div>

      {showAll && (
        <select
          value={decision ?? ''}
          onChange={(e) => onDecide(e.target.value === '' ? null : Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
        >
          <option value="">— Sem detalhamento —</option>
          {guides.map((g, idx) => (
            <option key={idx} value={idx}>
              {g.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { toDateStr } from './dateUtils'
import { upsertBodyMetric, type BodyMetricRow } from './api'

export function MetricEntryForm({
  profileId,
  metrics,
  onSaved,
}: {
  profileId: string
  metrics: BodyMetricRow[]
  onSaved: () => void
}) {
  const [date, setDate] = useState(() => toDateStr(new Date()))
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [arm, setArm] = useState('')
  const [thigh, setThigh] = useState('')
  const [showMeasures, setShowMeasures] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const existing = metrics.find((m) => m.date === date)

  useEffect(() => {
    setWeight(existing?.weight_kg?.toString() ?? '')
    setWaist(existing?.waist_cm?.toString() ?? '')
    setHip(existing?.hip_cm?.toString() ?? '')
    setArm(existing?.arm_cm?.toString() ?? '')
    setThigh(existing?.thigh_cm?.toString() ?? '')
    setSaved(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, existing?.id])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await upsertBodyMetric(profileId, date, {
        weight_kg: weight ? Number(weight) : null,
        waist_cm: waist ? Number(waist) : null,
        hip_cm: hip ? Number(hip) : null,
        arm_cm: arm ? Number(arm) : null,
        thigh_cm: thigh ? Number(thigh) : null,
      })
      setSaved(true)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900'

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">Data</span>
          <input
            type="date"
            value={date}
            max={toDateStr(new Date())}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">Peso (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="—"
            className={inputClass}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => setShowMeasures((v) => !v)}
        className="self-start text-xs font-semibold text-amber-600 dark:text-amber-400"
      >
        {showMeasures ? '− Ocultar medidas' : '+ Medidas (opcional)'}
      </button>

      {showMeasures && (
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">Cintura (cm)</span>
            <input type="number" inputMode="decimal" step="0.5" value={waist} onChange={(e) => setWaist(e.target.value)} className={inputClass} />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">Quadril (cm)</span>
            <input type="number" inputMode="decimal" step="0.5" value={hip} onChange={(e) => setHip(e.target.value)} className={inputClass} />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">Braço (cm)</span>
            <input type="number" inputMode="decimal" step="0.5" value={arm} onChange={(e) => setArm(e.target.value)} className={inputClass} />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">Coxa (cm)</span>
            <input type="number" inputMode="decimal" step="0.5" value={thigh} onChange={(e) => setThigh(e.target.value)} className={inputClass} />
          </label>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {saving ? 'Salvando…' : saved ? 'Salvo ✓' : 'Salvar registro'}
      </button>
    </form>
  )
}

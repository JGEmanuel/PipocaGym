import { useEffect, useState } from 'react'
import { finishSession, pauseSession, resumeSession, startSession } from './api'
import type { SessionRow } from './types'

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

function useElapsedMs(session: SessionRow | null): number {
  const [, setTick] = useState(0)
  useEffect(() => {
    if (session?.status !== 'em_andamento') return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [session?.status])

  if (!session) return 0
  const started = new Date(session.started_at).getTime()
  if (session.status === 'finalizado' && session.finished_at) {
    return new Date(session.finished_at).getTime() - started - session.paused_ms
  }
  if (session.status === 'pausado' && session.pause_started_at) {
    return new Date(session.pause_started_at).getTime() - started - session.paused_ms
  }
  return Date.now() - started - session.paused_ms
}

export function SessionBar({
  profileId,
  dayId,
  session,
  onChange,
}: {
  profileId: string
  dayId: string
  session: SessionRow | null
  onChange: (session: SessionRow) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const elapsed = useElapsedMs(session)

  async function run(action: () => Promise<SessionRow>) {
    setBusy(true)
    setError(null)
    try {
      onChange(await action())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar o treino.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sticky top-28 z-10 -mx-5 mb-4 mt-4 border-b border-stone-200 bg-white/85 px-5 py-3 backdrop-blur dark:border-stone-800 dark:bg-stone-950/85">
      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      {!session && (
        <button
          onClick={() => run(() => startSession(profileId, dayId))}
          disabled={busy}
          className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          Iniciar treino
        </button>
      )}

      {session?.status === 'finalizado' && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ Treino concluído · {formatDuration(elapsed)}
          </p>
          <button
            onClick={() => run(() => startSession(profileId, dayId))}
            disabled={busy}
            className="text-xs font-semibold text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
          >
            Treinar de novo
          </button>
        </div>
      )}

      {session && session.status !== 'finalizado' && (
        <div className="flex items-center gap-3">
          <span className="flex-1 font-mono text-2xl font-bold tabular-nums">{formatDuration(elapsed)}</span>
          {session.status === 'em_andamento' ? (
            <button
              onClick={() => run(() => pauseSession(session.id))}
              disabled={busy}
              className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-stone-100 disabled:opacity-60 dark:border-stone-700 dark:hover:bg-stone-800"
            >
              Pausar
            </button>
          ) : (
            <button
              onClick={() => run(() => resumeSession(session))}
              disabled={busy}
              className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              Retomar
            </button>
          )}
          <button
            onClick={() => run(() => finishSession(session))}
            disabled={busy}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            Finalizar
          </button>
        </div>
      )}
    </div>
  )
}

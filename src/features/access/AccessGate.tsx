import { useState, type FormEvent, type ReactNode } from 'react'
import { getAccessKey, saveAccessKey } from '../../lib/accessKey'
import { validateAccessKey } from '../../lib/supabase'

/**
 * Bloqueia o app até que a chave de acesso compartilhada seja informada.
 * A chave é validada contra o banco (políticas RLS) antes de ser salva
 * e passa a ser enviada em todas as requisições (header x-access-key).
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const [hasKey] = useState(() => Boolean(getAccessKey()))
  const [value, setValue] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (hasKey) return children

  async function submit(e: FormEvent) {
    e.preventDefault()
    const key = value.trim()
    if (!key || checking) return
    setChecking(true)
    setError(null)
    try {
      const valid = await validateAccessKey(key)
      if (!valid) {
        setError('Chave inválida. Confira e tente novamente.')
        return
      }
      saveAccessKey(key)
      // Recarrega para que o cliente Supabase seja criado já com o header
      window.location.reload()
    } catch {
      setError('Não foi possível verificar a chave. Confira sua conexão.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <span className="text-5xl">🐾</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
          Pipoca <span className="text-amber-500">Gym</span>
        </h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Informe a chave de acesso para entrar
        </p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Chave de acesso"
            autoFocus
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-center outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-stone-700 dark:bg-stone-900"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={checking}
            className="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition-transform hover:bg-amber-600 active:scale-[0.98] disabled:opacity-60"
          >
            {checking ? 'Verificando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

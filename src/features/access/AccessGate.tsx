import { useState, type FormEvent, type ReactNode } from 'react'
import { getAccessKey, saveAccessKey } from '../../lib/accessKey'

/**
 * Bloqueia o app até que a chave de acesso compartilhada seja informada.
 * A chave é enviada em todas as requisições ao Supabase (header x-access-key)
 * e validada pelas políticas RLS do banco — aqui só é coletada e armazenada.
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const [hasKey, setHasKey] = useState(() => Boolean(getAccessKey()))
  const [value, setValue] = useState('')

  if (hasKey) return children

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    saveAccessKey(value)
    // Recarrega para que o cliente Supabase seja criado já com o header
    window.location.reload()
    setHasKey(true)
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
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition-transform hover:bg-amber-600 active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

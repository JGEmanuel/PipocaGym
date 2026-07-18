import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { clearAccessKey } from '../lib/accessKey'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

const CARD_STYLES: Record<string, string> = {
  sky: 'from-sky-500/15 to-sky-500/5 border-sky-500/30',
  rose: 'from-rose-500/15 to-rose-500/5 border-rose-500/30',
  amber: 'from-amber-500/15 to-amber-500/5 border-amber-500/30',
}

export function Home() {
  const { data: profiles, isLoading, isError } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data as Profile[]
    },
  })

  function resetKey() {
    clearAccessKey()
    window.location.reload()
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">
          <span className="mr-1.5">🐾</span>
          Pipoca <span className="text-amber-500">Gym</span>
        </h1>
        <div className="flex items-center gap-1">
          <Link
            to="/gestao"
            aria-label="Gestão de treinos"
            className="flex size-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200 active:scale-95 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mt-10 flex flex-1 flex-col">
        <h2 className="text-lg font-semibold">Quem vai treinar hoje?</h2>

        {isLoading && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="aspect-square animate-pulse rounded-3xl bg-stone-200 dark:bg-stone-800" />
            <div className="aspect-square animate-pulse rounded-3xl bg-stone-200 dark:bg-stone-800" />
          </div>
        )}

        {(isError || profiles?.length === 0) && (
          <div className="mt-4 rounded-2xl border border-red-300/50 bg-red-50 p-4 text-sm dark:bg-red-950/30">
            <p>Não foi possível carregar os perfis. A chave de acesso pode estar incorreta.</p>
            <button onClick={resetKey} className="mt-2 font-semibold text-red-600 dark:text-red-400">
              Informar outra chave
            </button>
          </div>
        )}

        {profiles && profiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {profiles.map((p) => (
              <button
                key={p.id}
                className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl border bg-gradient-to-b text-lg font-semibold transition-transform hover:scale-[1.02] active:scale-[0.97] ${CARD_STYLES[p.color] ?? CARD_STYLES.amber}`}
              >
                <span className="text-5xl">{p.gender === 'm' ? '🏋️‍♂️' : '🏋️‍♀️'}</span>
                {p.name}
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
          Os treinos aparecem aqui após a carga dos planos (Fase 1).
        </p>
      </main>

      <footer className="mt-10 text-center text-xs text-stone-400 dark:text-stone-600">
        Feito com ❤️ em memória da Pipoca
      </footer>
    </div>
  )
}

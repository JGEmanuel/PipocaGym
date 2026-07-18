import { ThemeToggle } from '../components/ThemeToggle'

// Perfis fixos por enquanto — passam a vir do banco na Fase 1
const PROFILES = [
  { id: 'ele', name: 'Ele', emoji: '🏋️‍♂️', color: 'from-sky-500/15 to-sky-500/5 border-sky-500/30' },
  { id: 'ela', name: 'Ela', emoji: '🏋️‍♀️', color: 'from-rose-500/15 to-rose-500/5 border-rose-500/30' },
]

export function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">
          <span className="mr-1.5">🐾</span>
          Pipoca <span className="text-amber-500">Gym</span>
        </h1>
        <ThemeToggle />
      </header>

      <main className="mt-10 flex flex-1 flex-col">
        <h2 className="text-lg font-semibold">Quem vai treinar hoje?</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl border bg-gradient-to-b text-lg font-semibold transition-transform hover:scale-[1.02] active:scale-[0.97] ${p.color}`}
            >
              <span className="text-5xl">{p.emoji}</span>
              {p.name}
            </button>
          ))}
        </div>
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

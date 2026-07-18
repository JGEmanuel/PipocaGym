import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-stone-200 bg-white/85 backdrop-blur dark:border-stone-800 dark:bg-stone-950/85">
      <div className="mx-auto flex h-full w-full max-w-md items-center justify-between px-5">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="mr-1.5">🐾</span>
          Pipoca <span className="text-amber-500">Gym</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/progresso"
            aria-label="Progresso"
            className="flex size-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200 active:scale-95 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18M7 15l4-5 3 3 5-7" />
            </svg>
          </Link>
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
      </div>
    </header>
  )
}

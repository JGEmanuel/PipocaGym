import { Link } from 'react-router-dom'

export function PageHeader({ back, title, subtitle }: { back: string; title: string; subtitle?: string }) {
  return (
    <header className="sticky top-14 z-20 -mx-5 flex h-14 items-center gap-3 bg-white/85 px-5 backdrop-blur dark:bg-stone-950/85">
      <Link
        to={back}
        aria-label="Voltar"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-800"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Link>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>}
      </div>
    </header>
  )
}

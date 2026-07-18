import type { ReactNode } from 'react'

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(part)
    return m ? <strong key={`${keyPrefix}-${i}`}>{m[1]}</strong> : <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

/** Renderiza o corpo markdown de uma guia (parágrafos + rótulos em negrito). */
export function MarkdownBody({ md }: { md: string }) {
  const paragraphs = md
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed">
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p, `p${i}`)}</p>
      ))}
    </div>
  )
}

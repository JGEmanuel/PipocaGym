/** Normaliza um nome para comparação: minúsculas, sem acentos, sem pontuação. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[().,;:!?"'×]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(text: string): Set<string> {
  return new Set(normalize(text).split(' ').filter(Boolean))
}

function isSubset(a: Set<string>, b: Set<string>): boolean {
  for (const t of a) if (!b.has(t)) return false
  return true
}

/**
 * Compara dois nomes de exercício que podem divergir por qualificadores
 * (ex.: "Ponte unilateral assistida" vs. "Ponte Unilateral (Assistida ou Progressiva)").
 * Retorna true se um dos conjuntos de palavras contém inteiramente o outro.
 */
export function namesLooselyMatch(a: string, b: string): boolean {
  const ta = tokenize(a)
  const tb = tokenize(b)
  if (ta.size === 0 || tb.size === 0) return false
  return isSubset(ta, tb) || isSubset(tb, ta)
}

/** Diferença de tamanho entre os conjuntos de tokens — usada para desempate. */
export function tokenSizeDiff(a: string, b: string): number {
  return Math.abs(tokenize(a).size - tokenize(b).size)
}

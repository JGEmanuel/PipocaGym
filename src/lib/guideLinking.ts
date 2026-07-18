import { namesLooselyMatch, normalize, tokenSizeDiff } from './textNormalize'
import type { ParsedGuide } from './types'

export interface GuideAliasRow {
  alias_norm: string
  guide_name_norm: string
}

export interface LinkOutcome {
  guideIndex: number | null
  /** Índices de guias candidatas (correspondência parcial), ordenadas da mais provável para a menos. */
  candidateIndexes: number[]
}

/**
 * Tenta vincular o nome de um item (exercício/aquecimento/alongamento do dia)
 * a uma das guias de detalhamento da mesma apostila.
 *
 * Ordem de resolução: 1) alias já confirmado manualmente em upload anterior,
 * 2) correspondência textual por conjunto de palavras (uma contém a outra).
 * Quando há mais de uma guia igualmente próxima, não decide sozinho — devolve
 * as candidatas para revisão manual.
 */
export function linkItemToGuides(
  itemName: string,
  guides: ParsedGuide[],
  aliases: GuideAliasRow[],
): LinkOutcome {
  const itemNorm = normalize(itemName)

  const alias = aliases.find((a) => a.alias_norm === itemNorm)
  if (alias) {
    const idx = guides.findIndex((g) => normalize(g.name) === alias.guide_name_norm)
    if (idx !== -1) return { guideIndex: idx, candidateIndexes: [idx] }
  }

  const matches = guides
    .map((g, idx) => ({ idx, diff: tokenSizeDiff(itemName, g.name) }))
    .filter((_, idx) => namesLooselyMatch(itemName, guides[idx].name))

  if (matches.length === 0) return { guideIndex: null, candidateIndexes: [] }

  matches.sort((a, b) => a.diff - b.diff)
  const bestDiff = matches[0].diff
  const bestMatches = matches.filter((m) => m.diff === bestDiff)
  const candidateIndexes = matches.map((m) => m.idx)

  if (bestMatches.length === 1) {
    return { guideIndex: bestMatches[0].idx, candidateIndexes }
  }
  return { guideIndex: null, candidateIndexes }
}

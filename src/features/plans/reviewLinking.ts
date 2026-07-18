import { linkItemToGuides, type GuideAliasRow } from '../../lib/guideLinking'
import { normalize } from '../../lib/textNormalize'
import type { ParsedPlan } from '../../lib/types'

export interface ReviewEntry {
  key: string
  sampleName: string
  occurrences: number
  candidateIndexes: number[]
}

export interface ResolutionPlan {
  /** Chave = nome normalizado do item; valor = índice da guia em plan.guides, ou null (sem detalhamento). */
  resolutions: Map<string, number | null>
  /** Itens que precisam de decisão manual (ambíguos ou sem candidato). */
  reviewQueue: ReviewEntry[]
}

export function buildResolutionPlan(plan: ParsedPlan, aliases: GuideAliasRow[]): ResolutionPlan {
  const resolutions = new Map<string, number | null>()
  const occurrenceCount = new Map<string, number>()
  const sampleName = new Map<string, string>()
  const candidatesByKey = new Map<string, number[]>()

  for (const phase of plan.phases) {
    for (const day of phase.days) {
      for (const block of day.blocks) {
        for (const item of block.items) {
          const key = normalize(item.name)
          occurrenceCount.set(key, (occurrenceCount.get(key) ?? 0) + 1)
          if (!sampleName.has(key)) sampleName.set(key, item.name)
          if (resolutions.has(key)) continue

          const outcome = linkItemToGuides(item.name, plan.guides, aliases)
          resolutions.set(key, outcome.guideIndex)
          candidatesByKey.set(key, outcome.candidateIndexes)
        }
      }
    }
  }

  const reviewQueue: ReviewEntry[] = []
  for (const [key, guideIdx] of resolutions) {
    if (guideIdx === null) {
      reviewQueue.push({
        key,
        sampleName: sampleName.get(key)!,
        occurrences: occurrenceCount.get(key)!,
        candidateIndexes: candidatesByKey.get(key) ?? [],
      })
    }
  }
  reviewQueue.sort((a, b) => b.occurrences - a.occurrences)

  return { resolutions, reviewQueue }
}

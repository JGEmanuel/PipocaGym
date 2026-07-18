import { supabase } from '../../lib/supabase'
import { normalize } from '../../lib/textNormalize'
import type { GuideAliasRow } from '../../lib/guideLinking'
import type { ParsedPlan } from '../../lib/types'

export async function fetchGuideAliases(): Promise<GuideAliasRow[]> {
  const { data, error } = await supabase.from('guide_aliases').select('alias_norm, guide_name_norm')
  if (error) throw error
  return data
}

export interface PlanRow {
  id: string
  title: string
  created_at: string
  active: boolean
}

export async function fetchPlans(profileId: string): Promise<PlanRow[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('id, title, created_at, active')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function setPlanActive(planId: string, active: boolean) {
  const { error } = await supabase.from('plans').update({ active }).eq('id', planId)
  if (error) throw error
}

async function insertOne<T extends Record<string, unknown>>(table: string, row: T): Promise<string> {
  const { data, error } = await supabase.from(table).insert(row).select('id').single()
  if (error) throw error
  return data.id as string
}

export interface SaveProgress {
  done: number
  total: number
}

/**
 * Grava o plano inteiro no banco. Ramos independentes da árvore (fases entre si,
 * dias de uma mesma fase, blocos de um mesmo dia) são inseridos em paralelo —
 * cada inserção individual usa .select().single(), então a ordem de retorno de
 * cada chamada não importa; só os itens (folhas, sem filhos) vão em lote.
 */
export async function savePlan(
  profileId: string,
  rawMd: string,
  plan: ParsedPlan,
  resolutions: Map<string, number | null>,
  onProgress?: (p: SaveProgress) => void,
): Promise<string> {
  const totalSteps = 1 + plan.guides.length + countPhaseSteps(plan)
  let done = 0
  const tick = () => onProgress?.({ done: ++done, total: totalSteps })

  const planId = await insertOne('plans', {
    profile_id: profileId,
    title: plan.title,
    raw_md: rawMd,
    active: true,
  })
  tick()

  const guideIds = await Promise.all(
    plan.guides.map(async (g) => {
      const id = await insertOne('guides', { plan_id: planId, name: g.name, kind: g.kind, body_md: g.bodyMd })
      tick()
      return id
    }),
  )

  await Promise.all(
    plan.phases.map(async (phase, phaseIdx) => {
      const phaseId = await insertOne('plan_phases', { plan_id: planId, name: phase.name, position: phaseIdx })

      await Promise.all(
        phase.days.map(async (day, dayIdx) => {
          const dayId = await insertOne('plan_days', { phase_id: phaseId, name: day.name, position: dayIdx })

          await Promise.all(
            day.blocks.map(async (block, blockIdx) => {
              const blockId = await insertOne('plan_blocks', {
                day_id: dayId,
                kind: block.kind,
                title: block.title,
                position: blockIdx,
              })

              if (block.items.length > 0) {
                const payload = block.items.map((item, itemIdx) => {
                  const guideIdx = resolutions.get(normalize(item.name)) ?? null
                  return {
                    block_id: blockId,
                    name: item.name,
                    hint: item.hint,
                    prescription: item.prescription,
                    position: itemIdx,
                    guide_id: guideIdx !== null ? guideIds[guideIdx] : null,
                  }
                })
                const { error } = await supabase.from('plan_items').insert(payload)
                if (error) throw error
              }
              tick()
            }),
          )
        }),
      )
    }),
  )

  return planId
}

function countPhaseSteps(plan: ParsedPlan): number {
  let steps = 0
  for (const phase of plan.phases) {
    steps += 1
    for (const day of phase.days) {
      steps += 1
      steps += day.blocks.length
    }
  }
  return steps
}

export async function saveAliases(aliases: GuideAliasRow[]) {
  if (aliases.length === 0) return
  const { error } = await supabase
    .from('guide_aliases')
    .upsert(aliases, { onConflict: 'alias_norm,guide_name_norm', ignoreDuplicates: true })
  if (error) throw error
}

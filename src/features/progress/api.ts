import { supabase } from '../../lib/supabase'

export interface FinishedSession {
  id: string
  started_at: string
  finished_at: string
  paused_ms: number
  day_name: string
}

interface FinishedSessionRow {
  id: string
  started_at: string
  finished_at: string
  paused_ms: number
  plan_days: { name: string } | null
}

export async function fetchFinishedSessions(profileId: string): Promise<FinishedSession[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, started_at, finished_at, paused_ms, plan_days(name)')
    .eq('profile_id', profileId)
    .eq('status', 'finalizado')
    .order('started_at', { ascending: false })
    .limit(400)
  if (error) throw error
  return (data as unknown as FinishedSessionRow[]).map((s) => ({
    id: s.id,
    started_at: s.started_at,
    finished_at: s.finished_at,
    paused_ms: s.paused_ms,
    day_name: s.plan_days?.name ?? '',
  }))
}

export interface BodyMetricRow {
  id: string
  date: string
  weight_kg: number | null
  waist_cm: number | null
  hip_cm: number | null
  arm_cm: number | null
  thigh_cm: number | null
}

export async function fetchBodyMetrics(profileId: string): Promise<BodyMetricRow[]> {
  const { data, error } = await supabase
    .from('body_metrics')
    .select('id, date, weight_kg, waist_cm, hip_cm, arm_cm, thigh_cm')
    .eq('profile_id', profileId)
    .order('date')
  if (error) throw error
  return data
}

export async function upsertBodyMetric(
  profileId: string,
  date: string,
  fields: { weight_kg: number | null; waist_cm: number | null; hip_cm: number | null; arm_cm: number | null; thigh_cm: number | null },
) {
  const { error } = await supabase
    .from('body_metrics')
    .upsert({ profile_id: profileId, date, ...fields }, { onConflict: 'profile_id,date' })
  if (error) throw error
}

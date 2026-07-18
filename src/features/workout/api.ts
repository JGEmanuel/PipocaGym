import { supabase } from '../../lib/supabase'
import type { DayBlock, DayRow, PhaseRow, SessionRow } from './types'

export async function fetchPlanTitle(planId: string): Promise<string> {
  const { data, error } = await supabase.from('plans').select('title').eq('id', planId).single()
  if (error) throw error
  return data.title as string
}

export async function fetchPhases(planId: string): Promise<PhaseRow[]> {
  const { data, error } = await supabase
    .from('plan_phases')
    .select('id, name, position')
    .eq('plan_id', planId)
    .order('position')
  if (error) throw error
  return data
}

export async function fetchPhaseName(phaseId: string): Promise<string> {
  const { data, error } = await supabase.from('plan_phases').select('name').eq('id', phaseId).single()
  if (error) throw error
  return data.name as string
}

export async function fetchDays(phaseId: string): Promise<DayRow[]> {
  const { data, error } = await supabase
    .from('plan_days')
    .select('id, name, position')
    .eq('phase_id', phaseId)
    .order('position')
  if (error) throw error
  return data
}

export async function fetchDayName(dayId: string): Promise<string> {
  const { data, error } = await supabase.from('plan_days').select('name').eq('id', dayId).single()
  if (error) throw error
  return data.name as string
}

export async function fetchDayBlocks(dayId: string): Promise<DayBlock[]> {
  const { data, error } = await supabase
    .from('plan_blocks')
    .select('id, kind, title, position, plan_items(id, name, hint, prescription, position, guides(id, name, kind, body_md))')
    .eq('day_id', dayId)
    .order('position')
    .order('position', { referencedTable: 'plan_items' })
  if (error) throw error
  return data as unknown as DayBlock[]
}

export async function fetchOpenSession(profileId: string, dayId: string): Promise<SessionRow | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('profile_id', profileId)
    .eq('plan_day_id', dayId)
    .in('status', ['em_andamento', 'pausado'])
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function startSession(profileId: string, dayId: string): Promise<SessionRow> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ profile_id: profileId, plan_day_id: dayId })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function pauseSession(id: string): Promise<SessionRow> {
  const { data, error } = await supabase
    .from('sessions')
    .update({ status: 'pausado', pause_started_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function resumeSession(session: SessionRow): Promise<SessionRow> {
  const additionalPause = session.pause_started_at ? Date.now() - new Date(session.pause_started_at).getTime() : 0
  const { data, error } = await supabase
    .from('sessions')
    .update({
      status: 'em_andamento',
      paused_ms: session.paused_ms + additionalPause,
      pause_started_at: null,
    })
    .eq('id', session.id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function finishSession(session: SessionRow): Promise<SessionRow> {
  let pausedMs = session.paused_ms
  if (session.status === 'pausado' && session.pause_started_at) {
    pausedMs += Date.now() - new Date(session.pause_started_at).getTime()
  }
  const { data, error } = await supabase
    .from('sessions')
    .update({ status: 'finalizado', finished_at: new Date().toISOString(), paused_ms: pausedMs, pause_started_at: null })
    .eq('id', session.id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

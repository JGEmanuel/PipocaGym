import type { BlockKind, GuideKind } from '../../lib/types'

export interface PhaseRow {
  id: string
  name: string
  position: number
}

export interface DayRow {
  id: string
  name: string
  position: number
}

export interface ItemGuide {
  id: string
  name: string
  kind: GuideKind
  body_md: string
}

export interface DayItem {
  id: string
  name: string
  hint: string | null
  prescription: string | null
  position: number
  guides: ItemGuide | null
}

export interface DayBlock {
  id: string
  kind: BlockKind
  title: string
  position: number
  plan_items: DayItem[]
}

export type SessionStatus = 'em_andamento' | 'pausado' | 'finalizado'

export interface SessionRow {
  id: string
  profile_id: string
  plan_day_id: string
  status: SessionStatus
  started_at: string
  finished_at: string | null
  paused_ms: number
  pause_started_at: string | null
}

export interface Profile {
  id: string
  name: string
  gender: 'm' | 'f'
  color: string
  created_at: string
}

export type BlockKind = 'aquecimento' | 'principal' | 'cardio' | 'alongamento'
export type GuideKind = 'exercicio' | 'aquecimento_alongamento'

export interface ParsedGuide {
  name: string
  kind: GuideKind
  bodyMd: string
}

export interface ParsedItem {
  name: string
  hint: string | null
  prescription: string | null
}

export interface ParsedBlock {
  kind: BlockKind
  title: string
  items: ParsedItem[]
}

export interface ParsedDay {
  name: string
  blocks: ParsedBlock[]
}

export interface ParsedPhase {
  name: string
  days: ParsedDay[]
}

export interface ParsedPlan {
  title: string
  guides: ParsedGuide[]
  phases: ParsedPhase[]
}

export interface Plan {
  id: string
  profile_id: string
  title: string
  raw_md: string
  active: boolean
  created_at: string
}

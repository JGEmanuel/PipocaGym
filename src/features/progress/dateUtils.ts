export function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatMinutes(ms: number): string {
  const totalMin = Math.round(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`
}

/** Dias (YYYY-MM-DD, ordem decrescente) com pelo menos um treino finalizado. */
export function computeTrainedDates(sessions: { started_at: string }[]): Set<string> {
  return new Set(sessions.map((s) => toDateStr(new Date(s.started_at))))
}

export function computeStreak(trainedDates: Set<string>): number {
  let streak = 0
  const cursor = new Date()
  // Se ainda não treinou hoje, a sequência conta a partir de ontem.
  if (!trainedDates.has(toDateStr(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (trainedDates.has(toDateStr(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function countWithinDays(trainedDates: Set<string>, days: number): number {
  let count = 0
  const cursor = new Date()
  for (let i = 0; i < days; i++) {
    if (trainedDates.has(toDateStr(cursor))) count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

import type { BlockKind, ParsedBlock, ParsedDay, ParsedGuide, ParsedItem, ParsedPhase, ParsedPlan } from './types'

interface Section {
  heading: string
  level: 2 | 3
  bodyLines: string[]
}

/** Divide o markdown em seções por cabeçalho de nível 2 (##). */
function splitByH2(lines: string[]): Section[] {
  const sections: Section[] = []
  let current: Section | null = null
  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line)
    if (h2) {
      if (current) sections.push(current)
      current = { heading: h2[1].trim(), level: 2, bodyLines: [] }
    } else if (current) {
      current.bodyLines.push(line)
    }
  }
  if (current) sections.push(current)
  return sections
}

/** Divide o corpo de uma seção por cabeçalho de nível 3 (###). */
function splitByH3(lines: string[]): Section[] {
  const sections: Section[] = []
  let current: Section | null = null
  for (const line of lines) {
    const h3 = /^###\s+(.+)$/.exec(line)
    if (h3) {
      if (current) sections.push(current)
      current = { heading: h3[1].trim(), level: 3, bodyLines: [] }
    } else if (current) {
      current.bodyLines.push(line)
    }
  }
  if (current) sections.push(current)
  return sections
}

function parseGuideSection(section: Section, kind: ParsedGuide['kind']): ParsedGuide[] {
  // Ignora o parágrafo introdutório da seção (texto antes do primeiro ###),
  // que não pertence a nenhum exercício/aquecimento específico.
  const firstHeadingIdx = section.bodyLines.findIndex((l) => /^###\s+/.test(l))
  const relevantLines = firstHeadingIdx === -1 ? [] : section.bodyLines.slice(firstHeadingIdx)

  const chunks: string[][] = [[]]
  for (const line of relevantLines) {
    if (line.trim() === '---') {
      chunks.push([])
    } else {
      chunks[chunks.length - 1].push(line)
    }
  }
  const guides: ParsedGuide[] = []
  for (const chunk of chunks) {
    const nameLine = chunk.find((l) => /^###\s+/.test(l))
    if (!nameLine) continue
    const name = nameLine.replace(/^###\s+/, '').trim()
    const bodyMd = chunk
      .filter((l) => l !== nameLine)
      .join('\n')
      .trim()
    guides.push({ name, kind, bodyMd })
  }
  return guides
}

/** Divide o texto de um trecho " — " respeitando o travessão usado como separador de campos. */
function splitFields(text: string): string[] {
  return text.split(/\s+—\s+/).map((s) => s.trim())
}

function stripItalics(text: string): string {
  return text.replace(/^\*(.+)\*$/, '$1').trim()
}

function parseBulletItems(lines: string[]): ParsedItem[] {
  const items: ParsedItem[] = []
  for (const raw of lines) {
    const m = /^-\s+(.+)$/.exec(raw.trim())
    if (!m) continue
    const parts = splitFields(m[1])
    if (parts.length >= 3) {
      items.push({ name: parts[0], hint: stripItalics(parts[1]), prescription: parts.slice(2).join(' — ') })
    } else if (parts.length === 2) {
      items.push({ name: parts[0], hint: null, prescription: parts[1] })
    } else {
      items.push({ name: parts[0], hint: null, prescription: null })
    }
  }
  return items
}

function parseNumberedItems(lines: string[]): ParsedItem[] {
  const items: ParsedItem[] = []
  for (const raw of lines) {
    const m = /^\d+\.\s+(.+)$/.exec(raw.trim())
    if (!m) continue
    const parts = splitFields(m[1])
    items.push({ name: parts[0], hint: parts[1] ?? null, prescription: null })
  }
  return items
}

function parseTableItems(lines: string[]): ParsedItem[] {
  const items: ParsedItem[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line.startsWith('|')) continue
    if (/^\|[\s-:|]+\|$/.test(line)) continue // linha separadora ---|---|---
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
    if (cells.length < 2) continue
    if (/^exerc[íi]cio$/i.test(cells[0])) continue // linha de cabeçalho
    items.push({
      name: cells[0],
      hint: cells[1] || null,
      prescription: cells[2] || null,
    })
  }
  return items
}

function detectBlockKind(title: string): BlockKind {
  if (/bloco principal|bloco core/i.test(title)) return 'principal'
  if (/cardio final|cardio hiit|circuito hiit/i.test(title)) return 'cardio'
  if (/alongamento/i.test(title)) return 'alongamento'
  return 'aquecimento'
}

function parseDayBlocks(lines: string[]): ParsedBlock[] {
  const blocks: ParsedBlock[] = []
  let currentTitle: string | null = null
  let currentLines: string[] = []

  function flush() {
    if (currentTitle === null) return
    const kind = detectBlockKind(currentTitle)
    const items =
      kind === 'principal'
        ? parseTableItems(currentLines)
        : [...parseBulletItems(currentLines), ...parseNumberedItems(currentLines)]
    blocks.push({ kind, title: currentTitle, items })
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('**')) {
      flush()
      currentTitle = line.replace(/\*\*/g, '').trim()
      currentLines = []
    } else if (currentTitle !== null) {
      currentLines.push(raw)
    }
  }
  flush()
  return blocks
}

function parsePhaseSection(section: Section): ParsedPhase {
  const days = splitByH3(section.bodyLines).map(
    (daySection): ParsedDay => ({
      name: daySection.heading,
      blocks: parseDayBlocks(daySection.bodyLines),
    }),
  )
  return { name: section.heading, days }
}

export function parseWorkoutMarkdown(markdown: string): ParsedPlan {
  const lines = markdown.split(/\r?\n/)
  const titleLine = lines.find((l) => /^#\s+/.test(l))
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'Plano de Treino'

  const sections = splitByH2(lines)
  const guides: ParsedGuide[] = []
  const phases: ParsedPhase[] = []

  for (const section of sections) {
    if (/guia detalhado dos exerc[íi]cios/i.test(section.heading)) {
      guides.push(...parseGuideSection(section, 'exercicio'))
    } else if (/guia detalhado dos aquecimentos e alongamentos/i.test(section.heading)) {
      guides.push(...parseGuideSection(section, 'aquecimento_alongamento'))
    } else if (/^fase\s+\d+/i.test(section.heading)) {
      phases.push(parsePhaseSection(section))
    }
    // demais seções (Estrutura Geral, Contexto Clínico, Guia Nutricional, Sinais de Alerta)
    // são informativas e não fazem parte do fluxo de execução do treino
  }

  return { title, guides, phases }
}

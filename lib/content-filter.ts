// Filtro de conteúdo — bloqueia apenas conteúdo realmente absurdo
// Pregamos liberdade de expressão: palavrões leves passam
// O que é bloqueado: ódio, discriminação, ameaças explícitas

const BLOCKED_PATTERNS = [
  // Incitação ao ódio racial/étnico
  /\bn[i1]gg[e3]r\b/i,
  /\bviado\s*(do\s*caralho|merd|fdp)/i,

  // Ameaças explícitas
  /\bvou\s+te\s+(matar|estuprar|machucar)\b/i,
  /\bvou\s+(te\s+)?pegar\b.{0,20}\b(faca|arma|matar)\b/i,

  // Conteúdo sexual com menores — tolerância zero
  /\bpedofil/i,
  /\bcrian[çc]a.{0,20}\bsex/i,
  /\bmenor.{0,20}\bnua?\b/i,

  // Spam óbvio
  /\b(clique\s+aqui|compre\s+agora|ganhe\s+dinheiro|bitcoin\s+grátis)\b/i,
  /(https?:\/\/[^\s]+){3,}/i, // 3+ links = spam
]

export function containsBlockedContent(text: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text))
}

export function getBlockedReason(text: string): string | null {
  if (/\bn[i1]gg[e3]r\b/i.test(text) || /\bviado\s*(do\s*caralho|merd|fdp)/i.test(text)) {
    return 'Conteúdo discriminatório não é permitido.'
  }
  if (/\bvou\s+te\s+(matar|estuprar|machucar)\b/i.test(text)) {
    return 'Ameaças explícitas não são permitidas.'
  }
  if (/\bpedofil/i.test(text) || /\bcrian[çc]a.{0,20}\bsex/i.test(text)) {
    return 'Este conteúdo não é permitido.'
  }
  if (/(https?:\/\/[^\s]+){3,}/i.test(text)) {
    return 'Muitos links detectados. Parece spam.'
  }
  return 'Comentário não permitido.'
}

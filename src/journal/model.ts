export type Practice = { id: string; endedAt: string; seconds: number }
export type Journal = { completed: string[]; practice: Practice[] }

export function mergeJournal(local: Journal, remote: Journal): Journal {
  const byID = new Map(local.practice.map(entry => [entry.id, entry]))
  for (const entry of remote.practice) byID.set(entry.id, entry)
  return { completed: [...new Set([...local.completed, ...remote.completed])], practice: [...byID.values()] }
}

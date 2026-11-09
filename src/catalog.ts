import catalog from '../content/catalog.json'

export const stages = catalog.stages
export const scores = catalog.scores
export const chords: Record<string, number[]> = catalog.chords
export const lessons = stages.flatMap(stage => stage.lessons)
export type Lesson = typeof lessons[number]
export type Score = typeof scores[number]

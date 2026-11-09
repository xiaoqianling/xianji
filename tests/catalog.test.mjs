import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const catalog = JSON.parse(readFileSync(new URL('../content/catalog.json', import.meta.url)))

test('课程编号唯一，课程引用的和弦均可试听', () => {
  const lessons = catalog.stages.flatMap(stage => stage.lessons)
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length)
  for (const lesson of lessons) {
    for (const chord of lesson.chords) assert.ok(catalog.chords[chord])
  }
  for (const frets of Object.values(catalog.chords)) {
    assert.equal(frets.length, 6)
    assert.ok(frets.every(fret => Number.isInteger(fret) && fret >= -1 && fret <= 4))
  }
})

test('六线谱每小节的时值正确，音符落在有效弦与品位上', () => {
  for (const score of catalog.scores) {
    for (const [i, bar] of score.bars.entries()) {
      assert.equal(bar.reduce((sum, note) => sum + note.beats, 0), score.meter, score.id + ' bar ' + (i + 1))
      assert.ok(bar.every(note => note.string >= 1 && note.string <= 6 && note.fret >= 0 && note.fret <= 24 && note.beats > 0))
    }
  }
})

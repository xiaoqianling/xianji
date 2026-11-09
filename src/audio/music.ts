import { useEffect, useRef, useState } from 'react'
import type { Score } from '../catalog'

export const strings = [
  { label: 'E₂', midi: 40 }, { label: 'A₂', midi: 45 }, { label: 'D₃', midi: 50 },
  { label: 'G₃', midi: 55 }, { label: 'B₃', midi: 59 }, { label: 'E₄', midi: 64 },
]

type Sound = { beat: number; midi?: number; accent?: boolean; length?: number }
let audio: AudioContext | undefined
let stopActive: (() => void) | undefined

async function context() {
  audio ??= new AudioContext()
  await audio.resume()
  return audio
}

function sound(ctx: AudioContext, output: AudioNode, time: number, note: Sound) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const pluck = note.midi !== undefined
  const duration = pluck ? Math.min(note.length ?? 1.4, 1.4) : 0.055
  oscillator.type = pluck ? 'triangle' : 'sine'
  oscillator.frequency.value = pluck ? 440 * 2 ** ((note.midi! - 69) / 12) : note.accent ? 1320 : 820
  gain.gain.setValueAtTime(0.001, time)
  gain.gain.exponentialRampToValueAtTime(pluck ? 0.16 : note.accent ? 0.22 : 0.11, time + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration)
  oscillator.connect(gain).connect(output)
  oscillator.start(time)
  oscillator.stop(time + duration)
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
}

export async function previewNotes(notes: number[], spacing = 0.06) {
  const ctx = await context()
  notes.forEach((midi, i) => sound(ctx, ctx.destination, ctx.currentTime + 0.015 + i * spacing, { beat: 0, midi }))
}

export function scoreSequence(score: Score, start: number, end: number) {
  return score.bars.slice(start, end + 1).flatMap((bar, i) => {
    let beat = i * score.meter
    return bar.map(note => {
      const event = { beat, midi: strings[6 - note.string].midi + note.fret, length: note.beats }
      beat += note.beats
      return event
    })
  })
}

export function useTransport() {
  const [beat, setBeat] = useState<number | null>(null)
  const [error, setError] = useState('')
  const cancel = useRef<(() => void) | undefined>(undefined)
  const generation = useRef(0)

  function stop() {
    generation.current++
    cancel.current?.()
  }

  useEffect(() => {
    const onHidden = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', onHidden)
    return () => { stop(); document.removeEventListener('visibilitychange', onHidden) }
  }, [])

  async function play(sequence: Sound[], beats: number, bpm: number, loop: boolean) {
    stop()
    setError('')
    const current = generation.current
    try {
      const ctx = await context()
      if (generation.current !== current) return
      stopActive?.()
      const output = ctx.createGain()
      output.connect(ctx.destination)
      const origin = ctx.currentTime + 0.05
      const seconds = 60 / bpm
      let cursor = 0
      let cycle = 0
      let frame = 0
      const stopNow = () => {
        window.clearInterval(interval)
        cancelAnimationFrame(frame)
        output.disconnect()
        if (stopActive === stopNow) stopActive = undefined
        cancel.current = undefined
        setBeat(null)
      }
      // 提前把音符排入音频时钟。界面掉帧时，已经排程的音符仍按时发声。
      function schedule() {
        while ((loop || cycle === 0) && sequence.length) {
          const note = sequence[cursor]
          const time = origin + (cycle * beats + note.beat) * seconds
          if (time > ctx.currentTime + 0.12) break
          if (time >= ctx.currentTime - 0.04) {
            sound(ctx, output, Math.max(time, ctx.currentTime), { ...note, length: (note.length ?? 1) * seconds })
          }
          cursor++
          if (cursor === sequence.length) { cycle++; cursor = 0 }
        }
      }
      function paint() {
        const elapsed = Math.max(0, (ctx.currentTime - origin) / seconds)
        if (!loop && elapsed >= beats) { stopNow(); return }
        setBeat(Math.floor(elapsed) % beats)
        frame = requestAnimationFrame(paint)
      }
      const interval = window.setInterval(schedule, 25)
      stopActive = stopNow
      cancel.current = stopNow
      schedule()
      paint()
    } catch {
      setError('无法播放音频，请检查设备的音频设置。')
    }
  }
  return { beat, error, play, stop }
}

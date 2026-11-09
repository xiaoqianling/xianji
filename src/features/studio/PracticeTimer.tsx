import { useEffect, useRef, useState } from 'react'
import { Check, Clock3, Play, RotateCcw } from 'lucide-react'
import type { Practice } from '../../journal/model'

function timerText(seconds: number) {
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0')
}

export function PracticeTimer({ onSave }: { onSave: (practice: Practice) => void }) {
  const [work, setWork] = useState(60)
  const [rest, setRest] = useState(15)
  const [rounds, setRounds] = useState(4)
  const [start, setStart] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [saved, setSaved] = useState(false)
  const recorder = useRef<((seconds: number) => void) | null>(null)
  const cycle = work + rest
  const length = cycle * rounds - rest
  const currentRound = Math.min(rounds, Math.floor(elapsed / cycle) + 1)
  const offset = elapsed % cycle
  const resting = offset >= work

  useEffect(() => {
    if (start === null) return
    const tick = window.setInterval(() => {
      const seconds = Math.min(length, Math.floor((Date.now() - start) / 1000))
      setElapsed(seconds)
      if (seconds === length) recorder.current?.(seconds)
    }, 200)
    return () => window.clearInterval(tick)
  }, [start, length])

  function save(seconds: number) {
    if (!recorder.current) return
    recorder.current = null
    const practiced = Math.floor(seconds / cycle) * work + Math.min(seconds % cycle, work)
    if (practiced > 0) {
      onSave({ id: crypto.randomUUID(), endedAt: new Date().toISOString(), seconds: practiced })
      setSaved(true)
    }
    setStart(null)
    setElapsed(0)
  }

  return <section className="panel">
    <div className="panel-title"><Clock3 size={19}/><h2>循环练习</h2></div>
    <p>把难点留在一小段里，练习和休息交替进行。</p>
    <div className="tempo"><strong>{timerText(resting ? cycle - offset : work - offset)}</strong><span>{resting ? '休息' : '练习'}</span></div>
    <p className="muted">第 {currentRound} / {rounds} 轮</p>
    <div className="control-row">
      <label>练习 <select disabled={start !== null} value={work} onChange={e => setWork(+e.target.value)}>{[15,30,45,60,90,120,180].map(n => <option key={n} value={n}>{n} 秒</option>)}</select></label>
      <label>休息 <select disabled={start !== null} value={rest} onChange={e => setRest(+e.target.value)}>{[0,10,15,30,60].map(n => <option key={n} value={n}>{n} 秒</option>)}</select></label>
      <label>轮数 <select disabled={start !== null} value={rounds} onChange={e => setRounds(+e.target.value)}>{[1,2,3,4,5,6,8].map(n => <option key={n}>{n}</option>)}</select></label>
    </div>
    <button className="primary" onClick={() => {
      if (start !== null) save(Math.min(length, Math.floor((Date.now() - start) / 1000)))
      else { setSaved(false); recorder.current = save; setStart(Date.now()) }
    }}>{start === null ? <Play size={16}/> : <RotateCcw size={16}/>} {start === null ? '开始循环' : '结束并记录'}</button>
    {saved && <p className="status" role="status"><Check size={16}/> 已保存到练习记录</p>}
  </section>
}

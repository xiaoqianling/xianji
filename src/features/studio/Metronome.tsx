import { useRef, useState } from 'react'
import { AudioLines, Pause, Play } from 'lucide-react'
import { useTransport } from '../../audio/music'

export function Metronome({ initial = 72, initialMeter = 4 }: { initial?: number; initialMeter?: number }) {
  const [bpm, setBpm] = useState(initial)
  const [meter, setMeter] = useState(initialMeter)
  const [secondAccent, setAccent] = useState(true)
  const taps = useRef<number[]>([])
  const transport = useTransport()
  function tap() {
    const now = performance.now()
    if (now - (taps.current.at(-1) ?? 0) > 2200) taps.current = []
    taps.current = [...taps.current.slice(-4), now]
    const intervals = taps.current.length - 1
    if (intervals > 0) {
      transport.stop()
      setBpm(Math.max(35, Math.min(240, Math.round(60_000 * intervals / (now - taps.current[0])))))
    }
  }
  return <section className="panel metronome">
    <div className="panel-title"><AudioLines size={19}/><h2>节拍器</h2></div>
    <div className="tempo"><strong>{bpm}</strong><span>BPM</span></div>
    <input aria-label="节拍速度" type="range" min="35" max="240" value={bpm} onChange={e => { transport.stop(); setBpm(+e.target.value) }}/>
    <div className="beat-lights" aria-label={meter + ' 拍'}>
      {Array.from({ length: meter }, (_, i) => <span key={i} className={transport.beat === i ? 'lit' : ''}>{i + 1}</span>)}
    </div>
    <div className="control-row">
      <label>每小节
        <select value={meter} onChange={e => { transport.stop(); setMeter(+e.target.value) }}>
          {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} 拍</option>)}
        </select>
      </label>
      {meter === 6 && <label><input type="checkbox" checked={secondAccent} onChange={e => { transport.stop(); setAccent(e.target.checked) }}/> 第 4 拍次重音</label>}
      <button className="quiet" onClick={tap}>点按定速</button>
    </div>
    <button className="primary" onClick={() => {
      if (transport.beat !== null) transport.stop()
      else void transport.play(Array.from({ length: meter }, (_, i) => ({ beat: i, accent: i === 0 || (meter === 6 && secondAccent && i === 3) })), meter, bpm, true)
    }}>{transport.beat === null ? <Play size={16}/> : <Pause size={16}/>} {transport.beat === null ? '开始节拍' : '停止节拍'}</button>
    {transport.error && <p role="alert">{transport.error}</p>}
  </section>
}

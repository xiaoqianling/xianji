import { useState } from 'react'
import { ArrowDownRight, ArrowLeft, Pause, Play, Repeat2 } from 'lucide-react'
import { scores, type Score } from '../../catalog'
import { scoreSequence, useTransport } from '../../audio/music'

export function ScoreList({ open }: { open: (score: Score) => void }) {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('')
  const filtered = scores.filter(score => (!level || score.level === level) && (score.title + score.credit).toLowerCase().includes(query.trim().toLowerCase()))
  return <>
    <div className="page-heading"><span className="eyebrow">THE SONGBOOK</span><h1>熟悉的旋律</h1><p>从耳熟的乐句开始，听一遍，挑几小节，慢慢弹。</p></div>
    <div className="control-row score-filter"><input type="search" aria-label="搜索曲谱" placeholder="搜索曲名或作曲者" value={query} onChange={e => setQuery(e.target.value)}/>
      <select aria-label="难度" value={level} onChange={e => setLevel(e.target.value)}><option value="">全部难度</option><option>入门</option><option>进阶</option></select></div>
    <div className="score-list">{filtered.map((score, i) => <button className="score-card" key={score.id} onClick={() => open(score)}>
      <span className={'score-disc disc-' + (i % 3)}><Play size={18}/></span><span><strong>{score.title}</strong><small>{score.credit}</small></span><span className="pill">{score.level}</span><ArrowDownRight size={19}/>
    </button>)}</div>
    {!filtered.length && <p className="panel" role="status">没有匹配的曲谱。换个关键词，或清除难度筛选。</p>}
  </>
}

export function ScorePage({ score, back }: { score: Score; back: () => void }) {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(score.bars.length - 1)
  const [bpm, setBpm] = useState(score.bpm)
  const [loop, setLoop] = useState(false)
  const transport = useTransport()
  const activeBar = transport.beat === null ? -1 : start + Math.floor(transport.beat / score.meter)
  return <>
    <button className="text-button" onClick={back}><ArrowLeft size={17}/> 返回曲谱</button>
    <div className="page-heading"><span className="eyebrow">{score.level} · {score.meter}/4 · {score.bars.length} 小节</span><h1>{score.title}</h1><p>{score.credit}</p></div>
    <div className="panel score-player">
      <div className="control-row">
        <button className="primary" onClick={() => {
          if (transport.beat !== null) transport.stop()
          else void transport.play(scoreSequence(score, start, end), (end - start + 1) * score.meter, bpm, loop)
        }}>{transport.beat === null ? <Play size={16}/> : <Pause size={16}/>} {transport.beat === null ? '试听选段' : '停止试听'}</button>
        <button className={loop ? 'selected' : 'quiet'} aria-pressed={loop} onClick={() => { transport.stop(); setLoop(!loop) }}><Repeat2 size={17}/> 循环</button>
        <label>从第 <select aria-label="开始小节" value={start} onChange={e => { transport.stop(); setStart(+e.target.value); setEnd(Math.max(end, +e.target.value)) }}>
          {score.bars.map((_, i) => <option key={i} value={i}>{i + 1}</option>)}</select> 小节</label>
        <label>到第 <select aria-label="结束小节" value={end} onChange={e => { transport.stop(); setEnd(+e.target.value); setStart(Math.min(start, +e.target.value)) }}>
          {score.bars.map((_, i) => <option key={i} value={i}>{i + 1}</option>)}</select> 小节</label>
        <label><input aria-label="曲谱速度" type="range" min="35" max="160" value={bpm} onChange={e => { transport.stop(); setBpm(+e.target.value) }}/><strong>{bpm} BPM</strong></label>
      </div>
      {transport.error && <p role="alert">{transport.error}</p>}
      <p>{score.tip}</p>
      <div className="tab-grid">{score.bars.map((bar, index) => <div className={'tab-bar ' + (activeBar === index ? 'tab-active' : '')} key={index}>
        <small>第 {index + 1} 小节</small>
        <svg viewBox="0 0 172 98" role="img" aria-label={bar.map(note => note.string + ' 弦 ' + note.fret + ' 品 ' + note.beats + ' 拍').join('，')}>
          {['e','B','G','D','A','E'].map((s, i) => <g key={s}><text x="1" y={16+i*13} className="string-name">{s}</text><path d={'M16 '+(13+i*13)+'H168'} stroke="currentColor" opacity=".35"/></g>)}
          {bar.map((note, i) => {
            const x = 25 + bar.slice(0, i).reduce((sum, item) => sum + item.beats, 0) / score.meter * 137
            const y = 13 + (note.string - 1) * 13
            return <g key={i}><rect x={x-7} y={y-6} width="14" height="12" rx="3"/><text x={x} y={y+4} textAnchor="middle">{note.fret}</text></g>
          })}
        </svg>
      </div>)}</div>
    </div>
  </>
}

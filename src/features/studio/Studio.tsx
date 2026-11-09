import { Check } from 'lucide-react'
import { Metronome } from './Metronome'
import { PracticeTimer } from './PracticeTimer'
import { ReferenceTools } from './ReferenceTools'
import type { Journal, Practice } from '../../journal/model'

export function Studio({ params, journal, save }: { params: URLSearchParams; journal: Journal; save: (entry: Practice) => void }) {
  const bpm = Math.max(35, Math.min(240, Number(params.get('bpm')) || 72))
  const meter = params.get('meter') === '6' ? 6 : 4
  return <>
    <div className="page-heading"><span className="eyebrow">THE PRACTICE ROOM</span><h1>留一点时间给琴弦</h1><p>跟住节拍，慢练一段，再听听自己的声音。</p></div>
    <div className="two-column"><Metronome initial={bpm} initialMeter={meter}/><PracticeTimer onSave={save}/></div>
    <ReferenceTools/>
    <section className="panel"><div className="panel-title"><Check size={19}/><h2>最近的练习</h2></div>
      {journal.practice.length ? <ul className="practice-list">{[...journal.practice].sort((a, b) => b.endedAt.localeCompare(a.endedAt)).slice(0, 10).map(entry => <li key={entry.id}><time dateTime={entry.endedAt}>{new Date(entry.endedAt).toLocaleString('zh-CN')}</time><strong>{Math.floor(entry.seconds / 60)} 分 {entry.seconds % 60} 秒</strong></li>)}</ul> : <p>完成一次循环练习后，这里会记录实际练习时长。</p>}
    </section>
  </>
}

import { useState } from 'react'
import { AudioLines } from 'lucide-react'
import { previewNotes, strings } from '../../audio/music'
import { ChordCard } from '../../components/ChordCard'
import { chords } from '../../catalog'

export function ReferenceTools() {
  const [active, setActive] = useState('')
  const [error, setError] = useState('')
  const failed = () => setError('无法播放参考音，请检查设备的音频设置。')
  return <div className="reference-tools">
    <section className="panel">
      <div className="panel-title"><AudioLines size={19}/><h2>标准调弦参考音</h2></div>
      <p>从六弦到一弦。点亮一个音，拨响对应的空弦并比对音高。</p>
      <div className="reference-strings">{strings.map((note, i) => <button key={note.label} className={active === note.label ? 'selected' : 'quiet'} onClick={() => {
        setActive(note.label)
        void previewNotes([note.midi]).catch(failed)
      }}><small>{6 - i} 弦</small><strong>{note.label}</strong></button>)}</div>
    </section>
    <section className="panel">
      <div className="panel-title"><h2>和弦指法库</h2></div>
      <p>从左到右对应六弦到一弦。○ 弹空弦，× 跳过该弦。点按图卡试听。</p>
      <div className="chord-grid">{Object.keys(chords).map(name => <ChordCard name={name} key={name} onError={failed}/>)}</div>
    </section>
    {error && <p role="alert">{error}</p>}
  </div>
}

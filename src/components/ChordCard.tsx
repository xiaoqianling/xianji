import { chords } from '../catalog'
import { previewNotes, strings } from '../audio/music'

export function ChordCard({ name, onError }: { name: string; onError: () => void }) {
  const frets = chords[name]
  return <button className="chord-card" aria-label={'试听 ' + name + ' 和弦'}
    onClick={() => void previewNotes(frets.flatMap((fret, i) => fret < 0 ? [] : [strings[i].midi + fret])).catch(onError)}>
    <strong>{name}</strong>
    <svg viewBox="0 0 108 99" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => <path key={i} d={'M14 '+(23+i*16)+'H94'} stroke="currentColor" opacity={i ? '.32' : '.8'} strokeWidth={i ? 1 : 3}/>)}
      {frets.map((fret, i) => <g key={i}>
        <path d={'M'+(14+i*16)+' 23v64'} stroke="currentColor" opacity=".35"/>
        {fret > 0 ? <circle cx={14+i*16} cy={15+fret*16} r="5" fill="currentColor"/> : <text x={14+i*16} y="16" textAnchor="middle" fill="currentColor" fontSize="13">{fret === 0 ? '○' : '×'}</text>}
      </g>)}
    </svg>
  </button>
}

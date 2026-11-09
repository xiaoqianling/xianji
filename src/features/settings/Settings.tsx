import { useState } from 'react'
import { Cloud, Copy, Palette } from 'lucide-react'
import { syncJournal, type SyncConfig } from '../../journal/sync'
import type { Journal } from '../../journal/model'

const palettes = [
  { id: 'fern', title: '蕨影', detail: '苔绿与浅金', swatches: ['#153b37', '#b5c3a1', '#f1cf91'] },
  { id: 'blue', title: '月汐', detail: '深蓝与雾白', swatches: ['#253e61', '#a4b9de', '#e7ddbd'] },
  { id: 'plum', title: '暮弦', detail: '梅紫与粉灰', swatches: ['#53394f', '#cda3c1', '#eed4a6'] },
] as const
const modes = [{ id: 'auto', label: '跟随系统' }, { id: 'light', label: '浅色' }, { id: 'dark', label: '深色' }] as const
export type Theme = { palette: typeof palettes[number]['id']; mode: typeof modes[number]['id'] }

export function Settings({ theme, setTheme, sync, setSync, journal, merge }: {
  theme: Theme; setTheme: (value: Theme) => void; sync: SyncConfig; setSync: (value: SyncConfig) => void; journal: Journal; merge: (value: Journal) => void
}) {
  const [draft, setDraft] = useState(sync)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    setError('')
    try {
      const remote = await syncJournal({ url: draft.url.trim(), token: draft.token.trim() }, journal, config => { setSync(config); setDraft(config) })
      merge(remote)
      setStatus('同步完成。课程和练习记录已合并。')
    } catch (error) {
      setError(error instanceof Error ? error.message : '同步失败，请稍后重试。')
    } finally { setBusy(false) }
  }

  return <>
    <div className="page-heading"><span className="eyebrow">YOUR SPACE</span><h1>把这里布置成你喜欢的样子</h1></div>
    <section className="panel settings-panel">
      <div className="panel-title"><Palette size={20}/><h2>主题</h2></div>
      <div className="palette-grid">{palettes.map(palette => <button key={palette.id} className={theme.palette === palette.id ? 'selected' : 'quiet'} aria-pressed={theme.palette === palette.id} onClick={() => setTheme({ ...theme, palette: palette.id })}>
        <span className="swatches" aria-hidden="true">{palette.swatches.map(color => <i key={color} style={{ background: color }}/>)}</span>
        <strong>{palette.title}</strong><small>{palette.detail}</small>
      </button>)}</div>
      <div className="control-row">{modes.map(mode => <button key={mode.id} className={theme.mode === mode.id ? 'selected' : 'quiet'} aria-pressed={theme.mode === mode.id} onClick={() => setTheme({ ...theme, mode: mode.id })}>{mode.label}</button>)}</div>
    </section>
    <section className="panel settings-panel">
      <div className="panel-title"><Cloud size={20}/><h2>跨设备同步</h2></div>
      <p>记录自动保存在本机。配置弦迹 Go 服务后，可手动同步课程进度和练习记录。</p>
      <form className="sync-form" onSubmit={submit}>
        <label>服务地址 <input type="url" value={draft.url} required disabled={busy} placeholder="https://guitar.example.com" onChange={e => setDraft({ url: e.target.value, token: '' })}/></label>
        <label>同步令牌 <input type="password" value={draft.token} autoComplete="off" disabled={busy} placeholder="留空创建新档案" onChange={e => setDraft({ ...draft, token: e.target.value })}/></label>
        <div className="actions"><button className="primary" disabled={busy}>{busy ? '正在同步…' : '同步记录'}</button>
        {draft.token && <button type="button" className="quiet" disabled={busy} onClick={async () => {
          setError('')
          try { await navigator.clipboard.writeText(draft.token); setStatus('已复制令牌。可在另一台设备粘贴。') }
          catch { setError('无法访问剪贴板，请从令牌输入框手动复制。') }
        }}><Copy size={15}/> 复制令牌</button>}</div>
      </form>
      {error && <p role="alert">{error}</p>}{status && <p role="status">{status}</p>}
    </section>
  </>
}

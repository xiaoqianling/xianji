import { useEffect, useState } from 'react'
import { AudioLines, BookOpen, Disc3, House, Settings2 } from 'lucide-react'
import { lessons, scores } from './catalog'
import { Home } from './features/home/Home'
import { Studio } from './features/studio/Studio'
import { CourseList, LessonPage } from './features/learning/Courses'
import { ScoreList, ScorePage } from './features/songs/Scores'
import { Settings, type Theme } from './features/settings/Settings'
import { useStored } from './journal/useStored'
import { mergeJournal, type Journal } from './journal/model'
import type { SyncConfig } from './journal/sync'

const routes = [
  { id: 'home', label: '首页', icon: House },
  { id: 'learn', label: '课程', icon: BookOpen },
  { id: 'songs', label: '曲谱', icon: Disc3 },
  { id: 'studio', label: '练习', icon: AudioLines },
] as const

function Logo() {
  return <a className="brand" href="#home" aria-label="弦迹首页">
    <img src="./icon.svg" alt=""/><span><strong>弦迹</strong><small>XIANJI</small></span>
  </a>
}

export function App() {
  const [hash, setHash] = useState(location.hash.slice(1) || 'home')
  const [journal, setJournal] = useStored<Journal>('xianji.journal.v1', { completed: [], practice: [] })
  const [theme, setTheme] = useStored<Theme>('xianji.theme.v1', { palette: 'fern', mode: 'auto' })
  const [sync, setSync] = useStored<SyncConfig>('xianji.sync.v1', { url: '', token: '' })
  const [path, search] = hash.split('?')
  const [page, id] = path.split('/')
  const lesson = lessons.find(item => item.id === id)
  const score = scores.find(item => item.id === id)

  useEffect(() => {
    function navigate() {
      setHash(location.hash.slice(1) || 'home')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.palette = theme.palette
    document.documentElement.dataset.mode = theme.mode
  }, [theme])

  const open = (route: string) => { location.hash = route }
  const complete = (id: string) => setJournal(previous => mergeJournal(previous, { completed: [id], practice: [] }))

  return <div className="app-shell">
    <header className="topbar"><div className="topbar-inner">
      <Logo/>
      <nav aria-label="主导航">{routes.map(({ id, icon: Icon, label }) => <a key={id} href={'#' + id} aria-current={page === id ? 'page' : undefined}><Icon size={17}/><span>{label}</span></a>)}</nav>
      <a className="settings-button" aria-label="设置" aria-current={page === 'settings' ? 'page' : undefined} href="#settings"><Settings2 size={21}/></a>
    </div></header>
    <main className="workspace" key={hash}>
      {page === 'learn' ? lesson ? <LessonPage lesson={lesson} completed={journal.completed.includes(lesson.id)} back={() => open('learn')} finish={() => complete(lesson.id)} open={item => open('learn/' + item.id)}/> :
        <CourseList completed={journal.completed} open={item => open('learn/' + item.id)}/> :
        page === 'songs' ? score ? <ScorePage score={score} back={() => open('songs')}/> : <ScoreList open={item => open('songs/' + item.id)}/> :
        page === 'studio' ? <Studio params={new URLSearchParams(search)} journal={journal} save={entry => setJournal(previous => mergeJournal(previous, { completed: [], practice: [entry] }))}/> :
        page === 'settings' ? <Settings theme={theme} setTheme={setTheme} sync={sync} setSync={setSync} journal={journal} merge={remote => setJournal(previous => mergeJournal(previous, remote))}/> :
        <Home journal={journal}/>}
    </main>
    <footer><span>弦迹 · 自学吉他</span><span>六根弦，慢慢来。</span></footer>
  </div>
}

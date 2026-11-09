import { ArrowDownRight, ArrowRight, BookOpen, ChevronRight, Clock3, Disc3 } from 'lucide-react'
import { lessons, scores, stages } from '../../catalog'
import { GuitarArt } from './GuitarArt'
import type { Journal } from '../../journal/model'

export function Home({ journal }: { journal: Journal }) {
  const next = lessons.find(lesson => !journal.completed.includes(lesson.id))
  const today = new Date().toDateString()
  const practice = journal.practice.filter(entry => new Date(entry.endedAt).toDateString() === today).reduce((sum, entry) => sum + entry.seconds, 0)
  return <>
    <div className="home-kicker"><span className="eyebrow"><i/> YOUR GUITAR STUDIO</span><span>一间随身的吉他练习室</span></div>
    <section className="hero">
      <GuitarArt/>
      <div className="hero-copy">
        <span className="eyebrow">弦迹手记 <i/> VOL. 01</span>
        <h1>把日子弹成歌<span>。</span></h1>
        <p>从第一个清亮的音开始。每天留一点时间，听琴弦，也听自己。</p>
        <a className="hero-action" href={next ? '#learn/' + next.id : '#learn'}>{next ? journal.completed.length ? '继续学习' : '开始第一课' : '回顾课程'} <ArrowRight size={17}/></a>
      </div>
      <span className="hero-coordinate">FIG. 01 · ACOUSTIC GUITAR</span>
    </section>
    <div className="home-grid">
      <section className="panel home-lesson">
        <div className="section-top"><span className="icon-chip"><BookOpen size={19}/></span><span className="eyebrow">01 / 学习路径</span></div>
        <h2>{next?.title ?? '四段旅程，全部完成'}</h2>
        <p>{next ? '下一课 · ' + next.minutes + ' 分钟' : '选一节课，重新听听熟悉的声音。'}</p>
        <progress max={lessons.length} value={journal.completed.length} aria-label="课程进度"/>
        <div className="card-foot"><small>已完成 {journal.completed.length} / {lessons.length} 节</small><a href="#learn">全部课程 <ChevronRight size={15}/></a></div>
      </section>
      <section className="panel home-studio">
        <div className="section-top"><span className="icon-chip"><Clock3 size={19}/></span><span className="eyebrow">02 / 今日练习</span></div>
        <h2>{practice >= 60 ? Math.floor(practice / 60) : practice} <small>{practice >= 60 ? '分钟' : '秒'}</small></h2>
        <p>节拍器、分段计时、调弦参考音。</p>
        <a className="text-button" href="#studio">打开练习室 <ArrowRight size={16}/></a>
      </section>
      <section className="panel home-songs">
        <div className="section-top"><span className="icon-chip"><Disc3 size={19}/></span><span className="eyebrow">03 / 曲谱集</span></div>
        <h2>熟悉的旋律</h2><p>{scores.length} 首六线谱，可以慢速试听和循环。</p>
        <a className="text-button" href="#songs">翻开曲谱 <ArrowRight size={16}/></a>
      </section>
    </div>
    <section className="path-strip">
      <div><span className="eyebrow">THE FOUR MOVEMENTS</span><h2>学琴的四段旅程</h2></div>
      <div className="path-steps">{stages.map((stage, i) => <a href={'#learn/' + stage.lessons[0].id} key={stage.id}><small>0{i + 1}</small><strong>{stage.label}</strong><ArrowDownRight size={17}/></a>)}</div>
    </section>
  </>
}

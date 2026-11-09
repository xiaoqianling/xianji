import { useState } from 'react'
import { ArrowDownRight, ArrowLeft, ArrowRight, BookOpen, Check } from 'lucide-react'
import { lessons, stages, type Lesson } from '../../catalog'
import { ChordCard } from '../../components/ChordCard'

export function CourseList({ completed, open }: { completed: string[]; open: (lesson: Lesson) => void }) {
  return <>
    <div className="page-heading"><span className="eyebrow">THE LEARNING PATH</span><h1>一根弦，一小步</h1><p>按四段旅程往前走，每节课都留一个可以听出来的小目标。</p></div>
    <div className="course-list">{stages.map((stage, i) => <section className="panel course" key={stage.id}>
      <div className="course-heading"><span className="stage-index">0{i + 1}</span><div><span className="eyebrow">{stage.label}</span><h2>{stage.title}</h2><p>{stage.description}</p></div></div>
      {stage.lessons.map(lesson => <button className="lesson-row" key={lesson.id} onClick={() => open(lesson)}>
        {completed.includes(lesson.id) ? <Check size={17}/> : <BookOpen size={17}/>}<span>{lesson.title}</span><small>{lesson.minutes} 分钟</small><ArrowDownRight size={17}/>
      </button>)}
    </section>)}</div>
  </>
}

export function LessonPage({ lesson, completed, back, finish, open }: {
  lesson: Lesson; completed: boolean; back: () => void; finish: () => void; open: (lesson: Lesson) => void
}) {
  const [error, setError] = useState(false)
  const stage = stages.find(stage => stage.lessons.some(item => item.id === lesson.id))!
  const next = lessons[lessons.indexOf(lesson) + 1]
  return <>
    <button className="text-button" onClick={back}><ArrowLeft size={17}/> 返回课程</button>
    <div className="page-heading"><span className="eyebrow">{stage.label} · {lesson.minutes} 分钟</span><h1>{lesson.title}</h1><p>{lesson.concept}</p></div>
    <div className="two-column">
      <section className="panel lesson-body">
        <h2>怎么练</h2><p>{lesson.practice}</p>
        <h2>听一听</h2><p>{lesson.listen}</p>
        <h2>今天的目标</h2><p>{lesson.goal}</p>
        {lesson.chords.length > 0 && <div className="chord-grid">{lesson.chords.map(name => <ChordCard name={name} key={name} onError={() => setError(true)}/>)}</div>}
        {error && <p role="alert">无法播放参考音，请检查音频设备。</p>}
        <div className="actions"><button className="primary" disabled={completed} onClick={finish}><Check size={17}/>{completed ? '已完成' : '标记完成'}</button>
          {next && <button className="quiet" onClick={() => open(next)}>下一课 <ArrowRight size={16}/></button>}</div>
      </section>
      <aside className="panel lesson-note"><span className="eyebrow">START SLOW</span><h2>{lesson.bpm} <small>BPM</small></h2><p>从这个速度开始。连续弹稳三遍，再小幅提速。</p>
        <a className="quiet" href={'#studio?bpm=' + lesson.bpm + (lesson.id === 'six-eight' ? '&meter=6' : '')}>用节拍器练习 <ArrowRight size={16}/></a>
      </aside>
    </div>
  </>
}

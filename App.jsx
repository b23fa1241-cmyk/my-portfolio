import { useEffect, useRef, useState } from 'react'
import { me, knowledge, hobbies, projects, dreams } from './data'

// cx: төвийн x (%), y: дээд ирмэг (%), ly: гэрлийн замын y (%)
const ISLANDS = [
  { id: 'knowledge', nav: 'Миний тухай', en: 'Knowledge Island', mn: 'Сурсан мэдлэг', c: '#4aa3ff', cx: 10, y: '2%', ly: 19, s: 1.1, p: 10, t: '7s' },
  { id: 'creativity', nav: 'Бүтээлч байдал', en: 'Creativity Island', mn: 'Бүтээлч байдал', c: '#ff6fae', cx: 90, y: '6%', ly: 20, s: 0.9, p: 18, t: '5s' },
  { id: 'project', nav: 'Бүтээлүүд', en: 'Project Island', mn: 'Хийсэн төслүүд', c: '#7ddc8a', cx: 24, y: '54%', ly: 68, s: 0.95, p: 26, t: '8s' },
  { id: 'future', nav: 'Холбоо барих', en: 'Future Island', mn: 'Ирээдүйн мөрөөдөл', c: '#ffd166', cx: 70, y: '54%', ly: 71, s: 1.1, p: 14, t: '9s' },
]

function Deco({ id }) {
  if (id === 'knowledge') return (
    <g>
      {[0, 1, 2].map((i) => <rect key={i} x={78 + i * 14} y={28 - i * 6} width="12" height={36 + i * 6} fill={['#fff', '#cfe6ff', '#9ccaff'][i]} />)}
      {[0, 120, 240].map((a, i) => (
        <g key={a}><animateTransform attributeName="transform" type="rotate" from={`${a} 100 60`} to={`${a + 360} 100 60`} dur={`${8 + i * 2}s`} repeatCount="indefinite" />
          <circle cx="100" cy={8 + i * 6} r="4" fill="#fff" /></g>
      ))}
    </g>)
  if (id === 'creativity') return (
    <g>{[[70, 52, 14, '#ffd166'], [105, 44, 18, '#8ad7ff'], [136, 54, 12, '#fff']].map(([x, y, r, f], i) => (
      <circle key={i} className="blob" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y} r={r} fill={f} />))}</g>)
  if (id === 'project') return (
    <g>{[60, 96, 130].map((x, i) => (
      <g key={x}><rect x={x} y={38 + i * 3} width="26" height={24 - i * 3} fill="#fff" />
        <path d={`M${x - 3} ${38 + i * 3} L${x + 13} ${24 + i * 3} L${x + 29} ${38 + i * 3}Z`} fill="#1d6b3a" />
        <rect className="win" style={{ animationDelay: `${i * 0.7}s` }} x={x + 9} y={46 + i * 3} width="8" height="8" fill="#ffd166" /></g>))}</g>)
  return (
    <g><path d="M100 4 L112 62 L88 62Z" fill="#fff" /><circle cx="100" cy="28" r="5" fill="#ffd166" />
      {[[40, 20], [160, 14], [150, 44], [52, 50]].map(([x, y], i) => (
        <circle key={i} className="tw" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={y} r="3" fill="#fff" />))}</g>)
}

function Panel({ id, onSecret }) {
  const [dots, setDots] = useState([])
  const [taps, setTaps] = useState(0)
  const paint = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setDots((d) => [...d.slice(-60), { x: e.clientX - r.left, y: e.clientY - r.top, h: Math.floor(Math.random() * 360) }])
  }
  if (id === 'knowledge') return (<>
    <p>{knowledge.bio}</p>
    <ul className="chips">{knowledge.skills.map((s) => <li key={s}>{s}</li>)}</ul></>)
  if (id === 'creativity') return (<>
    <p>Би: {hobbies.join(', ')}. Доорх талбар дээр дарж өнгө цац.</p>
    <div className="paint" onClick={paint} role="img" aria-label="Зурах талбар">
      {dots.map((d, i) => <i key={i} style={{ left: d.x, top: d.y, background: `hsl(${d.h} 90% 65%)` }} />)}
      {!dots.length && <em className="ph">Энд дарж өнгө цацаарай ✦</em>}
    </div></>)
  if (id === 'project') return (
    <div className="grid">{projects.map((p) => (
      <a className="card" key={p.t} href={p.url} target="_blank" rel="noreferrer">
        <div className="shot" style={{ background: `linear-gradient(135deg,hsl(${p.hue} 60% 40%),hsl(${p.hue + 40} 70% 20%))` }}>{p.t[0]}</div>
        <h3>{p.t}</h3><p>{p.d}</p><small>{p.tags.join(' · ')}</small>
      </a>))}</div>)
  const star = () => { const n = taps + 1; setTaps(n); if (n === 3) { onSecret(); setTaps(0) } }
  return (<>
    <button className="secret" onClick={star} aria-label="Нууц од">✦</button>
    <ul>{dreams.map((d) => <li key={d}>{d}</li>)}</ul>
    <h3>Дохио илгээх</h3>
    <p><a href={`mailto:${me.email}`}>{me.email}</a></p>
    <p><a href={me.github} target="_blank" rel="noreferrer">GitHub</a>
      {me.links.map((l) => <span key={l.n}> · <a href={l.u} target="_blank" rel="noreferrer">{l.n}</a></span>)}</p></>)
}

function IslandSvg({ id }) {
  return (
    <svg viewBox="0 0 200 170" aria-hidden="true">
      <path d="M8 72 Q100 44 192 72 Q172 122 100 164 Q28 122 8 72Z" fill="#2b2250" />
      <ellipse cx="100" cy="70" rx="92" ry="26" fill="var(--c)" />
      <Deco id={id} />
    </svg>
  )
}

const fromHash = () => ISLANDS.find((i) => '#' + i.id === location.hash)?.id || null
const ZOOM = 1.8

export default function App() {
  const [fly, setFly] = useState(fromHash)       // камер аль арал руу ойртсон бэ
  const [active, setActive] = useState(fromHash) // аль арлын мэдээлэл нээлттэй вэ
  const [meteors, setMeteors] = useState(false)
  const wref = useRef(null)
  const raf = useRef(0)
  const timer = useRef(0)
  const push = (id) => history.pushState(null, '', id ? '#' + id : location.pathname + location.search)

  // Арал дээр дарах ч, навигацийн холбоос ч, ‹ › сум ч энэ нэг функцийг дуудна
  const open = (id) => {
    clearTimeout(timer.current)
    push(id)
    setFly(id)
    if (active) setActive(id) // арлаас арал руу шууд шилжинэ (камер дамжина)
    else timer.current = setTimeout(() => setActive(id), 650)
  }
  const close = () => { clearTimeout(timer.current); push(null); setActive(null); setFly(null) }

  const k = ISLANDS.findIndex((i) => i.id === active)
  const cur = ISLANDS[k]
  const prev = ISLANDS[(k + 3) % 4], next = ISLANDS[(k + 1) % 4]
  const target = ISLANDS.find((i) => i.id === fly)

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') close()
      if (cur && e.key === 'ArrowLeft') open(prev.id)
      if (cur && e.key === 'ArrowRight') open(next.id)
    }
    const pop = () => { const id = fromHash(); setActive(id); setFly(id) } // хөтчийн «Back» товч
    addEventListener('keydown', key)
    addEventListener('popstate', pop)
    return () => { removeEventListener('keydown', key); removeEventListener('popstate', pop) }
  })

  const secret = () => { setMeteors(true); setTimeout(() => setMeteors(false), 4500) }
  const move = (e) => {
    if (raf.current) return
    const { clientX, clientY } = e
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      const el = wref.current
      if (!el) return
      el.style.setProperty('--mx', clientX / innerWidth - 0.5)
      el.style.setProperty('--my', clientY / innerHeight - 0.5)
    })
  }
  // Сонгосон арлыг дэлгэцийн дээд хэсгийн голд аваачна
  const cam = target ? `translate(${-ZOOM * (target.cx - 50)}%, ${-20 - ZOOM * (target.ly - 50)}%) scale(${ZOOM})` : 'none'

  return (
    <>
      <nav className="nav">
        <button className="brand" onClick={close}>{me.name}</button>
        <div>
          {ISLANDS.map((i) => (
            <a key={i.id} href={`#${i.id}`} className={active === i.id ? 'on' : ''} style={{ '--c': i.c }}
              aria-current={active === i.id ? 'page' : undefined} onClick={(e) => { e.preventDefault(); open(i.id) }}>{i.nav}</a>
          ))}
        </div>
      </nav>

      <main className="home" onMouseMove={move}>
        <div ref={wref} className={'world' + (fly ? ' has-fly' : '')} style={{ transform: cam }}>
          <svg className="lanes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {ISLANDS.map((a, i) => {
              const b = ISLANDS[[1, 3, 0, 2][i]]
              const d = `M${a.cx} ${a.ly} Q${(a.cx + b.cx) / 2} ${(a.ly + b.ly) / 2 + (i % 2 ? 9 : -9)} ${b.cx} ${b.ly}`
              return (<g key={a.id} stroke={a.c} fill="none">
                <path d={d} className="lane" vectorEffect="non-scaling-stroke" />
                <path d={d} pathLength="100" className="pulse" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * 1.1}s` }} /></g>)
            })}
          </svg>

          <header className="hero">
            <p className="hello">Миний дотоод ертөнц</p>
            <h1>{me.name}</h1>
            <p className="role">{me.role}</p>
            <p className="line">{me.line}</p>
          </header>

          {ISLANDS.map((i) => (
            <button key={i.id} className={'isl' + (fly === i.id ? ' on' : '')} onClick={() => open(i.id)}
              style={{ '--c': i.c, '--cx': i.cx, '--y': i.y, '--s': i.s, '--p': i.p, '--t': i.t }} aria-label={`${i.en}: ${i.mn}`}>
              <IslandSvg id={i.id} />
              <b>{i.en}</b><span>{i.mn}</span>
            </button>
          ))}
          <p className="scrollhint">Арал дээр дарж нис ✦</p>
        </div>

        {cur && (
          <div className="veil" onClick={close}>
            <section key={cur.id} className="panel" style={{ '--c': cur.c }} role="dialog" aria-label={cur.en} onClick={(e) => e.stopPropagation()}>
              <button className="x" onClick={close} aria-label="Хаах">×</button>
              <div className="pbody">
              <header className="ph-head">
                <div><h2>{cur.nav}</h2><p>{cur.en} · {cur.mn}</p></div>
              </header>
              <Panel id={cur.id} onSecret={secret} />
              </div>
            </section>
          </div>
        )}
      </main>

      {meteors && (
        <div className="rain" aria-live="polite">
          {Array.from({ length: 22 }, (_, j) => <i key={j} style={{ left: `${(j * 53) % 100}%`, animationDelay: `${(j % 7) * 0.2}s` }} />)}
          <p>Ирээдүй чинь одоо эхэлж байна 🚀</p>
        </div>
      )}
    </>
  )
}
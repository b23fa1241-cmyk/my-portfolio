import { useRef, useState } from 'react'
import { me, knowledge, hobbies, projects, dreams } from './data'

// cx: төвийн x (%), y: дээд ирмэг (%), ly: гэрлийн замын y (%)
const ISLANDS = [
  { id: 'knowledge', nav: 'Миний тухай', en: 'Knowledge Island', mn: 'Сурсан мэдлэг', c: '#4aa3ff', cx: 17, y: '6%', ly: 23, p: 10, t: '7s' },
  { id: 'creativity', nav: 'Бүтээлч байдал', en: 'Creativity Island', mn: 'Бүтээлч байдал', c: '#ff6fae', cx: 80, y: '2%', ly: 19, p: 18, t: '5s' },
  { id: 'project', nav: 'Бүтээлүүд', en: 'Project Island', mn: 'Хийсэн төслүүд', c: '#7ddc8a', cx: 30, y: '54%', ly: 71, p: 26, t: '8s' },
  { id: 'future', nav: 'Холбоо барих', en: 'Future Island', mn: 'Ирээдүйн мөрөөдөл', c: '#ffd166', cx: 78, y: '52%', ly: 69, p: 14, t: '9s' },
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

export default function App() {
  const [fly, setFly] = useState(null)
  const [meteors, setMeteors] = useState(false)
  const wref = useRef(null)
  const raf = useRef(0)
  const target = ISLANDS.find((i) => i.id === fly)

  // Арал руу «нисээд», дараа нь харгалзах хэсэг рүү гүйлгэнэ
  const pick = (id) => {
    if (fly) return
    setFly(id)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => setFly(null), 700)
    }, 650)
  }
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

  return (
    <>
      <nav className="nav">
        <a className="brand" href="#home">{me.name}</a>
        <div>{ISLANDS.map((i) => <a key={i.id} href={`#${i.id}`}>{i.nav}</a>)}</div>
      </nav>

      <main onMouseMove={move}>
        <section id="home" className="home">
          <div ref={wref} className={'world' + (fly ? ' has-fly' : '')}
            style={{ transformOrigin: target ? `${target.cx}% ${target.ly}%` : '50% 50%' }}>
            <svg className="lanes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {ISLANDS.map((a, i) => {
                const b = ISLANDS[[1, 3, 0, 2][i]] // Knowledge→Creativity→Future→Project→Knowledge
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
              <button key={i.id} className={'isl' + (fly === i.id ? ' on' : '')} onClick={() => pick(i.id)}
                style={{ '--c': i.c, '--cx': i.cx, '--y': i.y, '--p': i.p, '--t': i.t }} aria-label={`${i.en}: ${i.mn}`}>
                <IslandSvg id={i.id} />
                <b>{i.en}</b><span>{i.mn}</span>
              </button>
            ))}
            <p className="scrollhint">Арал дээр дарж нис, эсвэл доош гүйлгэ ↓</p>
          </div>
        </section>

        {ISLANDS.map((i) => (
          <section key={i.id} id={i.id} className="sec" style={{ '--c': i.c }}>
            <div className="inner">
              <header className="sh">
                <IslandSvg id={i.id} />
                <div><h2>{i.nav}</h2><p>{i.en} · {i.mn}</p></div>
              </header>
              <Panel id={i.id} onSecret={secret} />
            </div>
          </section>
        ))}
      </main>

      {meteors && (
        <div className="rain" aria-live="polite">
          {Array.from({ length: 22 }, (_, k) => <i key={k} style={{ left: `${(k * 53) % 100}%`, animationDelay: `${(k % 7) * 0.2}s` }} />)}
          <p>Ирээдүй чинь одоо эхэлж байна 🚀</p>
        </div>
      )}
      <footer>© {new Date().getFullYear()} {me.name} · React-ээр өөрөө бичсэн</footer>
    </>
  )
}
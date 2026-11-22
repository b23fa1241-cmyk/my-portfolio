import { useEffect, useRef, useState } from 'react'
import { me, about, works, skills } from './data'

// cx: төвийн x (%), y: дээд ирмэг (%), ly: гэрлийн замын y (%)
const ISLANDS = [
  { id: 'about', z: 1.8, oy: 16, world: 'Миний ертөнц', nav: 'Миний тухай', c: '#4aa3ff', cx: 15, y: '11%', ly: 27, s: 1.05, p: 10, t: '7s' },
  { id: 'works', world: 'Бүтээлийн ертөнц', nav: 'Бүтээлүүд', c: '#7ddc8a', cx: 85, y: '14%', ly: 28, s: 0.95, p: 18, t: '5s' },
  { id: 'skills', world: 'Ур чадварын ертөнц', nav: 'Ур чадвар', c: '#ff6fae', cx: 78, y: '57%', ly: 72, s: 1.05, p: 26, t: '8s' },
  { id: 'contact', z: 1.8, oy: 16, world: 'Харилцаа холбооны ертөнц', nav: 'Холбоо барих', c: '#ffd166', cx: 22, y: '58%', ly: 71, s: 1, p: 14, t: '9s' },
]

const P = {
  about: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  works: 'm8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14',
  skills: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  contact: 'm12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5',
  down: 'm6 9 6 6 6-6',
  edu: 'M2 9l10-5 10 5-10 5zM6 11.5V16c0 1 3 3 6 3s6-2 6-3v-4.5',
}
function Ico({ n }) {
  return <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d={P[n]} /></svg>
}
function Star() {
  return <svg className="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="#fff" /></svg>
}

function Deco({ id }) {
  if (id === 'about') return (
    <g>{[[70, 40, 14], [88, 24, 14], [106, 34, 14], [124, 8, 16]].map(([x, y, w], i) => (
      <rect key={i} className="bob" style={{ animationDelay: `${i * 0.3}s` }} x={x} y={y} width={w} height={64 - y} rx="2" fill="url(#glass)" stroke="#fff" strokeOpacity=".7" />))}</g>)
  if (id === 'works') return (
    <g>{[[52, 30, '#ffd166'], [92, 14, '#8ad7ff'], [130, 30, '#ff9ecb']].map(([x, y, c], i) => (
      <g key={i} className="bob" style={{ animationDelay: `${i * 0.5}s` }}>
        <rect x={x} y={y} width="30" height="24" rx="4" fill="url(#glass)" stroke="#fff" strokeOpacity=".8" />
        <rect x={x + 5} y={y + 5} width="12" height="9" rx="2" fill={c} />
        <rect x={x + 5} y={y + 17} width="20" height="2" rx="1" fill="#6d4bd1" />
      </g>))}</g>)
  if (id === 'skills') return (
    <g>
      <circle className="blob" cx="66" cy="50" r="15" fill="url(#sun)" />
      <circle className="blob" style={{ animationDelay: '.4s' }} cx="102" cy="40" r="21" fill="url(#orb)" />
      <g className="blob" style={{ animationDelay: '.8s' }}>
        <circle cx="138" cy="52" r="10" fill="#fff" /><circle cx="150" cy="56" r="8" fill="#f3e8ff" /><circle cx="128" cy="58" r="8" fill="#f3e8ff" />
      </g>
    </g>)
  return (
    <g>
      <circle cx="100" cy="38" r="28" fill="url(#glow)" />
      <path className="bob" d="M100 -2 L118 30 L100 64 L82 30Z" fill="url(#crys)" stroke="#fff" strokeOpacity=".8" />
      <path className="bob" d="M100 -2 L108 30 L100 64 L92 30Z" fill="#fff" opacity=".35" />
      {[[48, 24], [156, 20], [150, 48], [56, 46]].map(([x, y], i) => (
        <circle key={i} className="tw" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={y} r="2.6" fill="#fff" />))}
    </g>)
}

function Works({ start = 0 }) {
  const [i, setI] = useState(start) // аль төсөл
  const [k, setK] = useState(0) // аль зураг
  const [zoom, setZoom] = useState(false)
  const [ratio, setRatio] = useState(1.6) // одоогийн зургийн жинхэнэ харьцаа
  const w = works[i]
  const imgs = w.imgs.slice(0, 5) // дээд тал нь 5 зураг
  const has = imgs.length > 0
  const shots = has ? imgs : [0, 1, 2, 3, 4]
  const bg = (n) => ({ background: `linear-gradient(135deg,hsl(${w.hue + n * 35} 60% 42%),hsl(${w.hue + n * 35 + 40} 70% 20%))` })
  const pick = (n) => { setI(n); setK(0) }

  // Томруулсан үед Esc зөвхөн томруулалтыг хаана, ←/→ зураг солино
  useEffect(() => {
    if (!zoom) return
    const key = (e) => {
      if (!['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
      e.stopPropagation()
      if (e.key === 'Escape') setZoom(false)
      else setK((v) => (v + (e.key === 'ArrowRight' ? 1 : shots.length - 1)) % shots.length)
    }
    addEventListener('keydown', key, true)
    return () => removeEventListener('keydown', key, true)
  }, [zoom, shots.length])

  return (<>
    <div className="wsel">
      {works.map((x, n) => <button key={x.t} className={n === i ? 'on' : ''} onClick={() => pick(n)} title={x.t}>{x.t}</button>)}
    </div>
    <div className="wv">
      <div>
        <div className={'main' + (has ? '' : ' ph')} style={{ ...(has ? {} : bg(k)), '--r': ratio }} onClick={() => has && setZoom(true)}>
          {has ? <img src={imgs[k]} alt={`${w.t} — зураг ${k + 1}`} onLoad={(e) => setRatio(Math.min(3, Math.max(0.6, e.target.naturalWidth / e.target.naturalHeight)))} /> : <span>{w.t[0]}</span>}
          <em className="zh">{k + 1} / {shots.length}</em>
        </div>
        <div className="thumbs">
          {shots.map((sh, n) => (
            <button key={n} className={n === k ? 'on' : ''} onClick={() => setK(n)} aria-label={`Зураг ${n + 1}`} style={has ? undefined : bg(n)}>
              {has && <img src={sh} alt="" />}
            </button>
          ))}
        </div>
      </div>
      <div className="info">
        <h3>{w.t}</h3>
        <p>{w.d}</p>
        <ul className="chips">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        {w.url && w.url !== '#' && (<>
          <h4 className="k">Холбоос</h4>
          <a className="ulink" href={w.url} target="_blank" rel="noreferrer">{w.url.replace(/^https?:\/\//, '')}</a>
        </>)}
      </div>
    </div>
    {zoom && has && (
      <div className="lb" onClick={() => setZoom(false)}>
        <img src={imgs[k]} alt={`${w.t} — зураг ${k + 1}`} onClick={(e) => { e.stopPropagation(); setK((k + 1) % shots.length) }} />
      </div>
    )}
  </>)
}

function Panel({ id, onSecret, start }) {
  const [taps, setTaps] = useState(0)
  const initials = me.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  const star = () => { const n = taps + 1; setTaps(n); if (n === 3) { onSecret(); setTaps(0) } }
  if (id === 'about') return (<>
    <h4 className="k">Нэр</h4>
    <p className="big">{me.name}</p>
    <h4 className="k">Боловсрол</h4>
    {about.edu.map((e) => (
      <div className="edu" key={e.school}><b>{e.school}</b><span>{e.major} · {e.years}</span></div>))}
    <h4 className="k">Сонирхол</h4>
    <ul className="chips">{about.interests.map((x) => <li key={x}>{x}</li>)}</ul></>)
  if (id === 'works') return <Works start={start} />
  if (id === 'skills') return (
    <div className="sk">{skills.map((g) => (
      <div key={g.t}><h4 className="k">{g.t}</h4>
        <ul className="chips">{g.items.map((x) => <li key={x}>{x}</li>)}</ul></div>))}</div>)
  const rows = [
    ['✉', 'Имэйл', me.email, `mailto:${me.email}`],
    ['</>', 'GitHub', me.github.replace('https://', ''), me.github],
    ['in', 'LinkedIn', me.linkedin.replace('https://', ''), me.linkedin],
  ]
  return (<>
    <button className="secret" onClick={star} aria-label="Нууц од">✦</button>
    <div className="cl">{rows.map(([ic, n, v, u]) => (
      <a key={n} className="clink" href={u} target="_blank" rel="noreferrer">
        <span>{ic}</span><b>{n}</b><em>{v}</em></a>))}</div></>)
}

function WorkCard({ w }) {
  const imgs = w.imgs.slice(0, 5)
  const [k, setK] = useState(0)
  const [r, setR] = useState(2) // зургийн жинхэнэ харьцаа
  const has = imgs.length > 0
  const bg = (n) => ({ background: `linear-gradient(135deg,hsl(${w.hue + n * 35} 60% 42%),hsl(${w.hue + n * 35 + 40} 70% 20%))` })
  return (
    <article className="wcard">
      <div className="thumb" style={has ? { aspectRatio: r } : { aspectRatio: 1.8, ...bg(k) }}>
        {has
          ? <img src={imgs[k]} alt={`${w.t} — зураг ${k + 1}`} loading="lazy" onLoad={(e) => setR(Math.min(3, Math.max(0.8, e.target.naturalWidth / e.target.naturalHeight)))} />
          : <span>{w.t[0]}</span>}
      </div>
      {imgs.length > 1 && (
        <div className="thumbs">
          {imgs.map((im, n) => (
            <button key={n} className={n === k ? 'on' : ''} onClick={() => setK(n)} aria-label={`Зураг ${n + 1}`}><img src={im} alt="" /></button>))}
        </div>)}
      <div className="cbody">
        <h3>{w.t}</h3>
        <p>{w.d}</p>
        <ul className="chips">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        {w.url && w.url !== '#' && (
          <a className="wlink" href={w.url} target="_blank" rel="noreferrer">{w.url.replace(/^https?:\/\//, '')} ↗</a>)}
      </div>
    </article>
  )
}

function SecHead({ eyebrow, a, b, p }) {
  return (
    <header className="sec-h">
      <div className="eyebrow"><i />{eyebrow}<i /></div>
      <h2>{a} <em>{b}</em></h2>
      <div className="rule" aria-hidden="true"><i />✦<i /></div>
      {p && <p className="sec-p">{p}</p>}
    </header>
  )
}

function IslandSvg({ id }) {
  return (
    <svg viewBox="-14 -4 228 176" aria-hidden="true">
      <defs>
        <linearGradient id="rk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a56e0" /><stop offset="1" stopColor="#241466" /></linearGradient>
        <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset="1" stopColor="#a9c6ff" stopOpacity=".7" /></linearGradient>
        <linearGradient id="crys" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1e8ff" /><stop offset="1" stopColor="#8f6bff" /></linearGradient>
        <radialGradient id="sun"><stop offset="0" stopColor="#fff6c2" /><stop offset="1" stopColor="#ffb347" /></radialGradient>
        <radialGradient id="orb" cx=".35" cy=".35"><stop offset="0" stopColor="#e3f0ff" /><stop offset="1" stopColor="#6f8cff" /></radialGradient>
        <radialGradient id="glow"><stop offset="0" stopColor="#ffd166" stopOpacity=".7" /><stop offset="1" stopColor="#ffd166" stopOpacity="0" /></radialGradient>
        <linearGradient id="ring" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".1" /><stop offset=".5" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity=".1" /></linearGradient>
      </defs>
      <g transform="rotate(-8 100 74)" fill="none">
        <ellipse cx="100" cy="74" rx="110" ry="30" stroke="url(#ring)" strokeWidth="2" />
        <circle r="3.5" fill="#fff"><animateMotion dur="10s" repeatCount="indefinite" path="M-10 74a110 30 0 1 0 220 0a110 30 0 1 0-220 0" /></circle>
      </g>
      <path d="M8 72 Q100 46 192 72 Q176 118 138 142 Q112 168 100 164 Q88 168 62 142 Q24 118 8 72Z" fill="url(#rk)" />
      <ellipse cx="100" cy="70" rx="92" ry="26" fill="var(--c)" />
      <ellipse cx="100" cy="64" rx="84" ry="19" fill="url(#hl)" />
      {[[38, 72], [162, 74], [58, 82]].map(([x, y], i) => (
        <g key={i}><rect x={x - 1.5} y={y - 4} width="3" height="8" fill="#6b4a3a" /><circle cx={x} cy={y - 9} r={9 - i} fill="#2f9e62" /><circle cx={x - 2} cy={y - 11} r="5" fill="#52c98a" /></g>))}
      <g transform="rotate(-8 100 74)" fill="none"><path d="M-10 74a110 30 0 0 0 220 0" stroke="url(#ring)" strokeWidth="2" /></g>
      <Deco id={id} />
    </svg>
  )
}

const fromHash = () => ISLANDS.find((i) => '#' + i.id === location.hash)?.id || null
const ZOOM = 1.35

export default function App() {
  const [fly, setFly] = useState(fromHash)       // камер аль арал руу ойртсон бэ
  const [active, setActive] = useState(fromHash) // аль арлын мэдээлэл нээлттэй вэ
  const [meteors, setMeteors] = useState(false)
  const [start, setStart] = useState(0) // «Бүтээлийн ертөнц» аль төслөөс эхлэх
  const wref = useRef(null)
  const raf = useRef(0)
  const timer = useRef(0)
  const push = (id) => history.pushState(null, '', id ? '#' + id : location.pathname + location.search)

  // Арал дээр дарах ч, навигацийн холбоос ч, ‹ › сум ч энэ нэг функцийг дуудна
  const open = (id, n = 0) => {
    clearTimeout(timer.current)
    setStart(n)
    if (scrollY > 40) scrollTo({ top: 0, behavior: 'smooth' }) // доороос дарсан ч арлын нислэг харагдана
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

  useEffect(() => { document.body.style.overflow = active ? 'hidden' : '' }, [active])
  useEffect(() => { // доорх хэсгүүд гүйлгэхэд аажим гарч ирнэ
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
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
  const z = target?.z ?? ZOOM
  const oy = target?.oy ?? 21
  const initials = me.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  const cam = target ? `translate(${-z * (target.cx - 50)}%, ${-oy - z * (target.ly - 50)}%) scale(${z})` : 'none'

  return (
    <>
      <nav className="nav">
        <button className="brand" onClick={close} aria-label="Нүүр"><span className="logo"><Star /></span></button>
        <div className="links">
          {ISLANDS.map((i) => (
            <a key={i.id} href={`#${i.id}`} className={active === i.id ? 'on' : ''} style={{ '--c': i.c }}
              aria-current={active === i.id ? 'page' : undefined} onClick={(e) => { e.preventDefault(); open(i.id) }}><Ico n={i.id} />{i.nav}</a>
          ))}
        </div>
      </nav>

      <main className="home" onMouseMove={move}>
        <div className="sky" aria-hidden="true">
          <span className="planet" /><span className="moon" />
          <i className="meteor" style={{ top: '16%', left: '58%' }} />
          <i className="meteor" style={{ top: '40%', left: '90%', animationDelay: '2.5s' }} />
          <i className="meteor" style={{ top: '9%', left: '32%', animationDelay: '5s' }} />
          <span className="clouds" />
        </div>
        <div ref={wref} className={'world' + (fly ? ' has-fly' : '')} style={{ transform: cam }}>
          <svg className="lanes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {ISLANDS.map((a, i) => {
              const b = ISLANDS[(i + 1) % 4]
              const d = `M${a.cx} ${a.ly} Q${(a.cx + b.cx) / 2} ${(a.ly + b.ly) / 2 + (i % 2 ? 9 : -9)} ${b.cx} ${b.ly}`
              return (<g key={a.id} stroke={a.c} fill="none">
                <path d={d} className="lane" vectorEffect="non-scaling-stroke" />
                <path d={d} pathLength="100" className="pulse" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * 1.1}s` }} /></g>)
            })}
          </svg>

          <header className="hero">
            <div className="eyebrow"><i />МИНИЙ ПОРТФОЛИО<i /></div>
            <h1><span>{me.name.split(' ')[0]}</span><em>{me.name.split(' ').slice(1).join(' ')}</em></h1>
            <div className="rule" aria-hidden="true"><i />✦<i /></div>
            <p className="role">{me.role}</p>
            <p className="line">{me.line}</p>
          </header>

          {ISLANDS.map((i) => (
            <button key={i.id} className={'isl' + (fly === i.id ? ' on' : '')} onClick={() => open(i.id)}
              style={{ '--c': i.c, '--cx': i.cx, '--y': i.y, '--s': i.s, '--p': i.p, '--t': i.t }} aria-label={i.world}>
              <IslandSvg id={i.id} />
              <b className="pill"><Ico n={i.id} />{i.world}</b>
            </button>
          ))}
          
        </div>

        {cur && (
          <div className="veil" onClick={close}>
            <section key={cur.id} className={'panel' + (cur.id === 'works' ? ' wide' : cur.id === 'about' || cur.id === 'contact' ? ' narrow' : '')} style={{ '--c': cur.c }} role="dialog" aria-label={cur.world} onClick={(e) => e.stopPropagation()}>
              <button className="x" onClick={close} aria-label="Хаах">×</button>
              <div className="pbody">
              <header className="ph-head">
                <h2>{cur.world}</h2>
              </header>
              <Panel id={cur.id} onSecret={secret} start={start} />
              </div>
            </section>
          </div>
        )}
      </main>

      <div id="site" className="site">
        <div className="deco" aria-hidden="true">
          <span className="planet p1" /><span className="planet p2" />
          <i className="meteor" style={{ top: '12%', left: '70%' }} />
          <i className="meteor" style={{ top: '55%', left: '40%', animationDelay: '3s' }} />
        </div>

        <section className="band reveal" style={{ '--c': '#4aa3ff' }}>
          <SecHead eyebrow="Танилцуулга" a="Миний" b="тухай" />
          <div className="cgrid">
            <div className="ccard abcard">
              <div className="mono">{initials}</div>
              <h4 className="k">Нэр</h4>
              <p className="big">{me.name}</p>
              <p className="fq">{me.line}</p>
            </div>
            <div className="ccard abcard">
              <div className="sico"><Ico n="edu" /></div>
              <h4 className="k">Боловсрол</h4>
              {about.edu.map((e) => (
                <div className="edu" key={e.school}><b>{e.school}</b><span>{e.major}</span><span>{e.years}</span></div>))}
            </div>
            <div className="ccard abcard">
              <div className="sico"><Ico n="skills" /></div>
              <h4 className="k">Сонирхол</h4>
              <ul className="chips">{about.interests.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="band reveal" style={{ '--c': '#7ddc8a' }}>
          <SecHead eyebrow="Бүтээлүүд" a="Онцлох" b="бүтээлүүд" />
          <div className="wgrid">
            {works.map((w) => <WorkCard key={w.t} w={w} />)}
          </div>
        </section>

        <section className="band reveal" style={{ '--c': '#ff6fae' }}>
          <SecHead eyebrow="Ур чадвар" a="Миний" b="чадварууд" />
          <div className="sk">{skills.map((g, n) => (
            <div key={g.t}>
              <div className="sico"><Ico n={['about', 'works', 'contact', 'skills'][n % 4]} /></div>
              <h4 className="k">{g.t}</h4>
              <ul className="chips">{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>))}</div>
        </section>

        <section className="band reveal" style={{ '--c': '#ffd166' }}>
          <SecHead eyebrow="Холбоо барих" a="Нэг холбоо," b="олон боломж" />
          <div className="cgrid">
            {[['mail', 'Имэйл', me.email, `mailto:${me.email}`], ['works', 'GitHub', me.github.replace('https://', ''), me.github], ['in', 'LinkedIn', me.linkedin.replace('https://', ''), me.linkedin]].map(([ic, n, v, u]) => (
              <a key={n} className="ccard" href={u} target={n === 'Имэйл' ? undefined : '_blank'} rel="noreferrer">
                <div className="sico">{ic === 'in' ? <b>in</b> : <Ico n={ic} />}</div>
                <h4 className="k">{n}</h4>
                <span>{v}</span>
              </a>))}
          </div>
        </section>

        <footer className="foot">
          <div className="fgrid">
            <div className="fcol fabout">
              <div className="fbrand"><span className="logo"><Star /></span><b>{me.name}</b></div>
              <p>{me.role}</p>
              <p className="fq">{me.line}</p>
            </div>
            <div className="fcol">
              <h4>Цэс</h4>
              {ISLANDS.map((i) => <button key={i.id} onClick={() => open(i.id)}>{i.nav}</button>)}
            </div>
            <div className="fcol">
              <h4>Бүтээлүүд</h4>
              {works.map((w, n) => <button key={w.t} onClick={() => open('works', n)}>{w.t}</button>)}
            </div>
            <div className="fcol">
              <h4>Холбоо барих</h4>
              <a href={`mailto:${me.email}`}>{me.email}</a>
              <a href={me.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
          <div className="fbot">
            <small>© {new Date().getFullYear()} {me.name}</small>
          </div>
        </footer>
      </div>

      {meteors && (
        <div className="rain" aria-live="polite">
          {Array.from({ length: 22 }, (_, j) => <i key={j} style={{ left: `${(j * 53) % 100}%`, animationDelay: `${(j % 7) * 0.2}s` }} />)}
          <p>Ирээдүй чинь одоо эхэлж байна 🚀</p>
        </div>
      )}
    </>
  )
}
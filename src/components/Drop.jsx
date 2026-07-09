import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import ProductCard from './ProductCard'

function useCountdown(target) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(target) - Date.now()))
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(target) - Date.now())), 1000)
    return () => clearInterval(t)
  }, [target])
  const d = Math.floor(left / 86400000)
  const h = Math.floor((left % 86400000) / 3600000)
  const m = Math.floor((left % 3600000) / 60000)
  const s = Math.floor((left % 60000) / 1000)
  return { d, h, m, s, done: left === 0 }
}

function Unit({ value, label }) {
  return (
    <div className="cd__unit">
      <span className="cd__value">{String(value).padStart(2, '0')}</span>
      <span className="cd__label">{label}</span>
    </div>
  )
}

function ComingSoon({ releaseDate }) {
  const { d, h, m, s } = useCountdown(releaseDate)
  return (
    <div className="cd">
      <Unit value={d} label="dias" />
      <Unit value={h} label="hrs" />
      <Unit value={m} label="min" />
      <Unit value={s} label="seg" />
    </div>
  )
}

function Live({ products }) {
  if (!products || products.length === 0) {
    return <p className="drop__ended">Produtos do drop em breve.</p>
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default function Drop() {
  const { drop } = useContent()
  const [, setTick] = useState(0)
  const raw = drop?.status
  const releaseReached =
    !!drop?.releaseDate && Date.now() >= new Date(drop.releaseDate).getTime()

  // comingSoon vira "live" sozinho quando a releaseDate chega (sem novo deploy)
  useEffect(() => {
    if (raw === 'comingSoon' && !releaseReached) {
      const t = setInterval(() => setTick((x) => x + 1), 1000)
      return () => clearInterval(t)
    }
  }, [raw, releaseReached])

  if (!raw || raw === 'inactive') return null
  const status = raw === 'comingSoon' && releaseReached ? 'live' : raw

  return (
    <section id="drop" className="section section--drop">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow section__eyebrow--light">Lançamento</span>
          <h2 className="section__title">{drop.name}</h2>
          <p className="section__lead section__lead--light">{drop.tagline}</p>
        </div>

        {status === 'comingSoon' && <ComingSoon releaseDate={drop.releaseDate} />}
        {status === 'live' && <Live products={drop.products} />}
        {status === 'ended' && <p className="drop__ended">Drop encerrado. Fique de olho no próximo.</p>}
      </div>
    </section>
  )
}

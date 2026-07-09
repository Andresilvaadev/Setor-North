import { useState, useEffect } from 'react'
import { useContent } from '../context/ContentContext'
import { ArrowIcon } from './Icons'

function HeroPhoto({ src, alt, className }) {
  const [error, setError] = useState(false)
  // Zera o erro quando a foto muda (ex.: fotos de exemplo -> fotos reais do admin).
  useEffect(() => { setError(false) }, [src])
  if (src && !error) {
    return <img className={className} src={src} alt={alt} onError={() => setError(true)} />
  }
  return (
    <div className={`${className} hero__photo-ph`}>
      <span>{alt}</span>
    </div>
  )
}

function HeroLogo({ hero }) {
  const [error, setError] = useState(false)
  if (hero.logo && !error) {
    return <img className="hero__logo" src={hero.logo} alt={hero.title} onError={() => setError(true)} />
  }
  return <h1 className="hero__title">{hero.title}</h1>
}

export default function Hero() {
  const { hero } = useContent()
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const photos = hero.images || []

  return (
    <section id="inicio" className="hero">
      <div className="hero__bg-text" aria-hidden="true">SETOR NORTH</div>
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__kicker">{hero.kicker}</span>
          <HeroLogo hero={hero} />
          <p className="hero__subtitle">{hero.subtitle}</p>
          <div className="hero__actions">
            <button className="btn btn--solid" onClick={() => go('catalogo')}>
              {hero.primaryCta} <ArrowIcon />
            </button>
            <button className="btn btn--outline" onClick={() => go('dtf')}>
              {hero.secondaryCta}
            </button>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="hero__gallery">
            <HeroPhoto src={photos[0]} alt="Setor North" className="hero__photo hero__photo--a" />
            {photos[1] && (
              <HeroPhoto src={photos[1]} alt="Setor North" className="hero__photo hero__photo--b" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { store } from '../data/siteContent'
import { useContent } from '../context/ContentContext'
import { InstagramIcon } from './Icons'

function LookImage({ img, index }) {
  const [error, setError] = useState(false)
  return (
    <div className={`look look--${index + 1}`}>
      {img.src && !error ? (
        <img src={img.src} alt={img.alt} loading="lazy" onError={() => setError(true)} />
      ) : (
        <div className="look__placeholder"><span>{img.alt}</span></div>
      )}
    </div>
  )
}

export default function Lookbook() {
  const { lookbook } = useContent()
  return (
    <section id="lookbook" className="section">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Identidade</span>
          <h2 className="section__title">{lookbook.title}</h2>
          <p className="section__lead">{lookbook.caption}</p>
        </div>

        <div className="lookbook">
          {lookbook.images.map((img, i) => (
            <LookImage key={i} img={img} index={i} />
          ))}
        </div>

        <div className="lookbook__cta">
          <a className="btn btn--outline" href={store.instagramUrl} target="_blank" rel="noopener noreferrer">
            <InstagramIcon /> {lookbook.instagramCta}
          </a>
        </div>
      </div>
    </section>
  )
}

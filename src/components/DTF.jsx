import { dtf } from '../data/siteContent'
import { dtfLink } from '../utils/whatsapp'
import { WhatsAppIcon } from './Icons'

export default function DTF() {
  return (
    <section id="dtf" className="section section--dark">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow section__eyebrow--light">Serviço</span>
          <h2 className="section__title">{dtf.title}</h2>
          <p className="section__lead section__lead--light">{dtf.subtitle}</p>
        </div>

        <div className="steps">
          {dtf.steps.map((s) => (
            <div key={s.n} className="step">
              <span className="step__n">{s.n}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="dtf__cta">
          <a className="btn btn--solid btn--light" href={dtfLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> {dtf.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

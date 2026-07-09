import { about } from '../data/siteContent'

export default function About() {
  return (
    <section id="sobre" className="section section--about">
      <div className="container about">
        <span className="section__eyebrow">{about.title}</span>
        <p className="about__text">{about.text}</p>
      </div>
    </section>
  )
}

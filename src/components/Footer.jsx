import { useState } from 'react'
import { store, footer } from '../data/siteContent'
import { contactLink } from '../utils/whatsapp'
import { WhatsAppIcon, InstagramIcon } from './Icons'

export default function Footer() {
  const [showChart, setShowChart] = useState(false)

  return (
    <footer id="contato" className="footer">
      <div className="container footer__inner">
        <div className="footer__col footer__col--brand">
          <span className="footer__brand">{store.name}</span>
          <p className="footer__tagline">{store.tagline} • {store.location}</p>
          <div className="footer__social">
            <a className="footer__icon" href={contactLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon size={22} />
            </a>
            <a className="footer__icon" href={store.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon size={22} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Atendimento</h4>
          <p className="footer__text">{footer.serviceNote}</p>
          <a className="footer__link" href={contactLink()} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </a>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Trocas</h4>
          <p className="footer__text">{footer.exchangePolicy}</p>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Tabela de medidas</h4>
          <button className="footer__link" onClick={() => setShowChart((v) => !v)}>
            {showChart ? 'Ocultar tabela' : 'Ver tabela'}
          </button>
          {showChart && (
            <table className="sizechart">
              <thead>
                <tr><th>Tam.</th><th>Peito</th><th>Comp.</th></tr>
              </thead>
              <tbody>
                {footer.sizeChart.map((r) => (
                  <tr key={r.size}><td>{r.size}</td><td>{r.chest}</td><td>{r.length}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottomrow">
          <span>© {new Date().getFullYear()} {store.name}. by <a href="https://valtryxsystems.com.br/" target="_blank" rel="noopener noreferrer" className="footer__valtryx">Valtryx Systems</a></span>
          <a className="footer__admin" href="/admin">Admin</a>
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect } from 'react'
import { store } from '../data/siteContent'
import { useContent } from '../context/ContentContext'
import { useCart } from '../context/CartContext'
import { CartIcon } from './Icons'

const baseLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'catalogo', label: 'Pronta Entrega' },
  { id: 'dtf', label: 'Personalização DTF' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { drop } = useContent()
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // O item "Drop" só aparece se o drop estiver ativado.
  const dropActive = drop?.status && drop.status !== 'inactive'
  const links = dropActive
    ? [...baseLinks.slice(0, 2), { id: 'drop', label: 'Drop' }, ...baseLinks.slice(2)]
    : baseLinks

  const go = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <button className="header__brand" onClick={() => go('inicio')} aria-label={store.name}>
          {store.logo ? (
            <img className="header__brand-logo" src={store.logo} alt={store.name} />
          ) : (
            <span className="header__brand-mark">SN</span>
          )}
          <span className="header__brand-name">{store.name}</span>
        </button>

        <nav className="header__nav" aria-label="Principal">
          {links.map((l) => (
            <button key={l.id} className={`header__link ${l.id === 'drop' ? 'header__link--drop' : ''}`} onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="header__right">
          <button className="header__cart" onClick={openCart} aria-label="Abrir carrinho">
            <CartIcon size={22} />
            {count > 0 && <span className="header__cart-badge">{count}</span>}
          </button>
          <button
            className={`header__burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`header__mobile ${open ? 'is-open' : ''}`}>
        {links.map((l) => (
          <button key={l.id} className="header__mobile-link" onClick={() => go(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
    </header>
  )
}

import { useState, useEffect } from 'react'
import { productLink, formatPrice, effectivePrice, isOnSale } from '../utils/whatsapp'
import { WhatsAppIcon, CartIcon } from './Icons'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const gallery = (product.images && product.images.length)
    ? product.images
    : (product.image ? [product.image] : [])
  const [size, setSize] = useState(product.sizes[0])
  const [imgError, setImgError] = useState(false)
  const [active, setActive] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const sold = product.status === 'esgotado'
  const onSale = isOnSale(product)
  const discountPct = onSale
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0

  const current = gallery[active]
  const hasMultiple = gallery.length > 1

  // Se a URL da imagem mudar (ex.: dados de exemplo -> dados reais do Supabase),
  // zera o erro para tentar carregar a nova imagem.
  useEffect(() => { setImgError(false) }, [current])

  const go = (dir) => {
    setActive((i) => (i + dir + gallery.length) % gallery.length)
  }

  function handleAddToCart() {
    addItem(product, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className={`card ${sold ? 'card--sold' : ''}`}>
      <div className="card__media">
        {current && !imgError ? (
          <img
            key={active}
            src={current}
            alt={`${product.name} — foto ${active + 1}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card__placeholder">
            <span>{product.id}</span>
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              className="card__nav card__nav--prev"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="card__nav card__nav--next"
              aria-label="Próxima foto"
              onClick={() => go(1)}
            >
              ›
            </button>
            <div className="card__dots" role="tablist" aria-label="Fotos">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`card__dot ${i === active ? 'card__dot--on' : ''}`}
                  aria-label={`Foto ${i + 1}`}
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          </>
        )}

        <span className="card__sku">{product.id}</span>
        {sold && <span className="card__badge">Esgotado</span>}
        {onSale && !sold && (
          <span className="card__badge card__badge--sale">-{discountPct}%</span>
        )}
        {product.featured && !sold && !onSale && (
          <span className="card__badge card__badge--feat">Destaque</span>
        )}
      </div>

      <div className="card__body">
        <div className="card__head">
          <h3 className="card__name">{product.name}</h3>
          <span className="card__cat">{product.category}</span>
        </div>
        <p className="card__meta">Cor: {product.color}</p>
        {isOnSale(product) ? (
          <p className="card__price card__price--sale">
            <span className="card__price-old">{formatPrice(product.price)}</span>
            <span className="card__price-now">{formatPrice(product.promoPrice)}</span>
            <span className="card__saleflag">Promoção</span>
          </p>
        ) : (
          <p className="card__price">{formatPrice(effectivePrice(product))}</p>
        )}

        <div className="card__sizes" role="group" aria-label="Tamanhos">
          {product.sizes.map((s) => (
            <button
              key={s}
              className={`size ${size === s ? 'size--active' : ''}`}
              onClick={() => setSize(s)}
              disabled={sold}
            >
              {s}
            </button>
          ))}
        </div>

        {sold ? (
          <button className="btn btn--ghost btn--block" disabled>Esgotado</button>
        ) : (
          <div className="card__actions">
            <button
              className={`btn btn--solid btn--block ${added ? 'btn--added' : ''}`}
              onClick={handleAddToCart}
            >
              <CartIcon size={18} />
              {added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
            </button>
            <a
              className="btn btn--outline btn--block"
              href={productLink(product, size)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Comprar pelo WhatsApp
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

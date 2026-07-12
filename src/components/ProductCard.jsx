import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, effectivePrice, isOnSale } from '../utils/whatsapp'

// Card do catálogo: vitrine limpa — capa, nome, preço e tamanhos.
// O card inteiro leva para a página de detalhes do produto.
export default function ProductCard({ product }) {
  const cover = (product.images && product.images[0]) || product.image || ''
  const [imgError, setImgError] = useState(false)

  // Se a URL da capa mudar (dados de exemplo -> dados reais), tenta carregar de novo.
  useEffect(() => { setImgError(false) }, [cover])

  const sold = product.status === 'esgotado'
  const onSale = isOnSale(product)
  const discountPct = onSale
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0

  return (
    <Link to={`/produto/${encodeURIComponent(product.id)}`} className={`card ${sold ? 'card--sold' : ''}`}>
      <div className="card__media">
        {cover && !imgError ? (
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card__placeholder">
            <span>{product.id}</span>
          </div>
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
        {onSale ? (
          <p className="card__price card__price--sale">
            <span className="card__price-old">{formatPrice(product.price)}</span>
            <span className="card__price-now">{formatPrice(product.promoPrice)}</span>
            <span className="card__saleflag">Promoção</span>
          </p>
        ) : (
          <p className="card__price">{formatPrice(effectivePrice(product))}</p>
        )}

        <span className="card__cta">Ver detalhes →</span>
      </div>
    </Link>
  )
}

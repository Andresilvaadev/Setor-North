import { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useCart } from '../context/CartContext'
import { productLink, formatPrice, effectivePrice, isOnSale } from '../utils/whatsapp'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { WhatsAppIcon, CartIcon } from '../components/Icons'

export default function ProductPage() {
  const { sku } = useParams()
  const { products, drop, loading } = useContent()
  const { addItem, openCart } = useCart()

  // Procura no catálogo e nas peças do drop
  const product = useMemo(() => {
    const all = [...products, ...(drop?.products || [])]
    return all.find((p) => p.id === sku) || null
  }, [products, drop, sku])

  const gallery = useMemo(() => {
    if (!product) return []
    return (product.images && product.images.length)
      ? product.images
      : (product.image ? [product.image] : [])
  }, [product])

  const [active, setActive] = useState(0)
  const [imgError, setImgError] = useState(false)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [sizeWarn, setSizeWarn] = useState(false)

  // Quando o produto chega/troca, reinicia a galeria e a seleção
  useEffect(() => {
    setActive(0)
    setQty(1)
    setSize(product?.sizes?.length === 1 ? product.sizes[0] : null)
  }, [product])

  const current = gallery[active]
  useEffect(() => { setImgError(false) }, [current])

  if (!product) {
    return (
      <>
        <Header />
        <main className="pp pp--empty">
          <div className="container">
            {loading ? (
              <p className="pp__loading">Carregando produto…</p>
            ) : (
              <>
                <h1 className="pp__notfound">Produto não encontrado</h1>
                <p className="pp__notfound-text">Este produto pode ter sido removido ou o link está incorreto.</p>
                <Link className="btn btn--solid" to="/">← Voltar ao catálogo</Link>
              </>
            )}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const sold = product.status === 'esgotado'
  const onSale = isOnSale(product)
  const discountPct = onSale
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0
  const needsSize = product.sizes.length > 0

  const ensureSize = () => {
    if (needsSize && !size) {
      setSizeWarn(true)
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!ensureSize()) return
    addItem(product, size || product.sizes[0], qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    openCart()
  }

  const handleBuyNow = (e) => {
    if (!ensureSize()) e.preventDefault()
  }

  return (
    <>
      <Header />
      <main className="pp">
        <div className="container">
          <nav className="pp__breadcrumb" aria-label="Navegação">
            <Link to="/">Início</Link>
            <span>/</span>
            <Link to="/" state={{ scrollTo: 'catalogo' }}>Catálogo</Link>
            <span>/</span>
            <strong>{product.name}</strong>
          </nav>

          <div className="pp__grid">
            {/* Galeria */}
            <div className="pp__gallery">
              <div className="pp__main">
                {current && !imgError ? (
                  <img src={current} alt={`${product.name} — foto ${active + 1}`} onError={() => setImgError(true)} />
                ) : (
                  <div className="pp__placeholder"><span>{product.id}</span></div>
                )}
                {sold && <span className="card__badge pp__badge">Esgotado</span>}
                {onSale && !sold && <span className="card__badge card__badge--sale pp__badge">-{discountPct}%</span>}
              </div>
              {gallery.length > 1 && (
                <div className="pp__thumbs" role="tablist" aria-label="Fotos do produto">
                  {gallery.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      className={`pp__thumb ${i === active ? 'pp__thumb--on' : ''}`}
                      aria-label={`Foto ${i + 1}`}
                      aria-selected={i === active}
                      onClick={() => setActive(i)}
                    >
                      <img src={url} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="pp__info">
              <span className="pp__cat">{product.category}</span>
              <h1 className="pp__name">{product.name}</h1>
              <span className="pp__sku">Ref.: {product.id}</span>

              {onSale ? (
                <p className="pp__price pp__price--sale">
                  <span className="card__price-old">{formatPrice(product.price)}</span>
                  <span className="card__price-now">{formatPrice(product.promoPrice)}</span>
                  <span className="card__saleflag">Promoção</span>
                </p>
              ) : (
                <p className="pp__price">{formatPrice(effectivePrice(product))}</p>
              )}

              {product.description && (
                <p className="pp__desc">{product.description}</p>
              )}

              <ul className="pp__details">
                {product.color && <li><strong>Cor:</strong> {product.color}</li>}
                <li><strong>Categoria:</strong> {product.category}</li>
              </ul>

              {needsSize && (
                <div className="pp__block">
                  <span className="pp__label">
                    Tamanho
                    {sizeWarn && !size && <em className="pp__warn"> — escolha um tamanho</em>}
                  </span>
                  <div className="card__sizes" role="group" aria-label="Tamanhos">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        className={`size ${size === s ? 'size--active' : ''}`}
                        onClick={() => { setSize(s); setSizeWarn(false) }}
                        disabled={sold}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!sold && (
                <div className="pp__block">
                  <span className="pp__label">Quantidade</span>
                  <div className="pp__qty">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir">−</button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Aumentar">+</button>
                  </div>
                </div>
              )}

              {sold ? (
                <button className="btn btn--ghost btn--block" disabled>Esgotado</button>
              ) : (
                <div className="pp__actions">
                  <button
                    className={`btn btn--solid btn--block ${added ? 'btn--added' : ''}`}
                    onClick={handleAddToCart}
                  >
                    <CartIcon size={18} />
                    {added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
                  </button>
                  <a
                    className="btn btn--outline btn--block"
                    href={productLink(product, size || product.sizes[0], qty)}
                    onClick={handleBuyNow}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon /> Comprar agora
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

import { useCart } from '../context/CartContext'
import { cartLink, formatPrice, effectivePrice, isOnSale } from '../utils/whatsapp'
import { WhatsAppIcon } from './Icons'

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, total, count, hasUnpricedItems, isOpen, closeCart } = useCart()

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={closeCart} />}
      <aside className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} aria-label="Carrinho">
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Carrinho {count > 0 && <span>({count})</span>}</h2>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Fechar carrinho">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">Seu carrinho está vazio.<br />Adicione produtos do catálogo.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map(({ product, size, qty }) => (
                <li key={`${product.id}-${size}`} className="cart-item">
                  <div className="cart-item__img">
                    {product.image
                      ? <img src={product.image} alt={product.name} />
                      : <span className="cart-item__placeholder">{product.id}</span>
                    }
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name">{product.name}</p>
                    <p className="cart-item__meta">Cor: {product.color} · Tam: {size}</p>
                    <p className="cart-item__price">
                      {effectivePrice(product) != null ? formatPrice(effectivePrice(product) * qty) : 'Sob consulta'}
                      {isOnSale(product) && (
                        <span className="cart-item__old">{formatPrice(product.price * qty)}</span>
                      )}
                    </p>
                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(product.id, size, qty - 1)} aria-label="Diminuir">−</button>
                      <span>{qty}</span>
                      <button onClick={() => updateQty(product.id, size, qty + 1)} aria-label="Aumentar">+</button>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeItem(product.id, size)} aria-label="Remover item">✕</button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__foot">
              <div className="cart-drawer__total">
                <span>Total</span>
                <span>
                  {total > 0 ? formatPrice(total) : 'Sob consulta'}
                  {hasUnpricedItems && total > 0 && <small> + sob consulta</small>}
                </span>
              </div>
              <a
                className="btn btn--solid btn--block"
                href={cartLink(items)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { clearCart(); closeCart() }}
              >
                <WhatsAppIcon /> Enviar pedido pelo WhatsApp
              </a>
              <button className="cart-drawer__clear" onClick={clearCart}>
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

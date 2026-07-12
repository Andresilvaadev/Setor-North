import { createContext, useContext, useState, useMemo } from 'react'
import { effectivePrice } from '../utils/whatsapp'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  function addItem(product, size, qty = 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id && i.size === size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { product, size, qty }]
    })
  }

  function removeItem(productId, size) {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)))
  }

  function updateQty(productId, size, qty) {
    if (qty < 1) {
      removeItem(productId, size)
      return
    }
    setItems(prev =>
      prev.map(i => i.product.id === productId && i.size === size ? { ...i, qty } : i)
    )
  }

  function clearCart() {
    setItems([])
  }

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((s, i) => s + (effectivePrice(i.product) ?? 0) * i.qty, 0), [items])
  const hasUnpricedItems = useMemo(() => items.some(i => effectivePrice(i.product) == null), [items])

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      count, total, hasUnpricedItems,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

import { store } from '../data/siteContent'

// Monta o link do WhatsApp com a mensagem já preenchida.
function buildLink(message) {
  const phone = store.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

// Formata preço em reais.
export function formatPrice(value) {
  if (value == null) return 'Sob consulta'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Preço que realmente vale: o promocional quando existir, senão o normal.
export function effectivePrice(product) {
  return product.promoPrice != null ? product.promoPrice : product.price
}

// Está em promoção? (tem promo válido e menor que o preço normal)
export function isOnSale(product) {
  return (
    product.promoPrice != null &&
    product.price != null &&
    product.promoPrice < product.price
  )
}

// Mensagem padrão para compra de um produto (com ID/SKU).
export function productLink(product, size, qty = 1) {
  const unit = effectivePrice(product)
  const message =
    `Olá! Tenho interesse neste produto da ${store.name}:\n\n` +
    `ID: ${product.id}\n` +
    `Produto: ${product.name}\n` +
    `Cor: ${product.color}\n` +
    `Tamanho: ${size || product.sizes[0]}\n` +
    (qty > 1 ? `Quantidade: ${qty}\n` : '') +
    `Preço: ${unit != null ? formatPrice(unit * qty) : 'Sob consulta'}${isOnSale(product) ? ' (promoção)' : ''}\n\n` +
    `Ainda está disponível?`
  return buildLink(message)
}

// Mensagem para orçamento de personalização DTF.
export function dtfLink() {
  const message =
    `Olá, ${store.name}! Quero um orçamento de personalização DTF.\n\n` +
    `Peça desejada: \n` +
    `Tamanho: \n` +
    `Quantidade: \n` +
    `(vou enviar a arte em seguida)`
  return buildLink(message)
}

// Mensagem genérica de contato.
export function contactLink() {
  const message = `Olá, ${store.name}! Vim pelo site e gostaria de mais informações.`
  return buildLink(message)
}

// Mensagem de pedido com múltiplos itens do carrinho.
export function cartLink(items) {
  const lines = items.map((item, i) => {
    const unit = effectivePrice(item.product)
    const qty = item.qty > 1 ? ` (x${item.qty})` : ''
    const price = unit != null
      ? formatPrice(unit * item.qty) + (isOnSale(item.product) ? ' (promoção)' : '')
      : 'Sob consulta'
    return `${i + 1}. ${item.product.name}${qty} — Tam.: ${item.size} — ${price}`
  })

  const total = items.reduce((s, i) => s + (effectivePrice(i.product) ?? 0) * i.qty, 0)
  const hasUnpriced = items.some(i => effectivePrice(i.product) == null)
  const totalLine = total > 0
    ? `\nTotal: ${formatPrice(total)}${hasUnpriced ? ' + itens sob consulta' : ''}`
    : '\nTotal: Sob consulta'

  const message =
    `Olá! Quero fazer um pedido na ${store.name}:\n\n` +
    lines.join('\n') +
    totalLine +
    `\n\nAinda estão disponíveis?`

  return buildLink(message)
}

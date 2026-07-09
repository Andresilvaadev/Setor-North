import { useMemo, useState } from 'react'
import { useContent } from '../context/ContentContext'
import ProductCard from './ProductCard'

export default function Catalog() {
  const { products, categories } = useContent()
  const [active, setActive] = useState('Todos')

  const filtered = useMemo(() => {
    if (active === 'Todos') return products
    return products.filter((p) => p.category === active)
  }, [active, products])

  return (
    <section id="catalogo" className="section">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Pronta entrega</span>
          <h2 className="section__title">Catálogo</h2>
          <p className="section__lead">Disponível pra envio imediato. Escolha, toque em comprar e fale com a gente no WhatsApp.</p>
        </div>

        <div className="filters">
          {categories.map((c) => (
            <button key={c} className={`filter ${active === c ? 'filter--active' : ''}`} onClick={() => setActive(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && <p className="empty">Nenhum produto nesta categoria por enquanto.</p>}
      </div>
    </section>
  )
}

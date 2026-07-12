import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import AdminApp from './admin/AdminApp'
import CartDrawer from './components/CartDrawer'

// Controla o scroll ao trocar de página: se a navegação pediu uma seção
// (state.scrollTo), rola até ela; senão volta ao topo.
function ScrollManager() {
  const location = useLocation()
  useEffect(() => {
    const id = location.state?.scrollTo
    if (id) {
      const t = setTimeout(() => {
        // O html já tem scroll-behavior: smooth no CSS — a animação vem de lá
        document.getElementById(id)?.scrollIntoView()
      }, 80)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [location])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:sku" element={<ProductPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
      <CartDrawer />
    </>
  )
}

import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminApp from './admin/AdminApp'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
      <CartDrawer />
    </>
  )
}

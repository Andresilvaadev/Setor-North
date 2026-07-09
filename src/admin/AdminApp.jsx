import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Login from './Login'
import ProductsAdmin from './ProductsAdmin'
import CategoriesAdmin from './CategoriesAdmin'
import DropAdmin from './DropAdmin'
import HeroAdmin from './HeroAdmin'
import './admin.css'

export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState('produtos')

  useEffect(() => {
    if (!supabase) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let active = true
    async function check() {
      if (!supabase || !session) {
        setIsAdmin(false)
        setChecking(false)
        return
      }
      setChecking(true)
      const { data, error } = await supabase.rpc('is_admin')
      if (active) {
        setIsAdmin(!error && data === true)
        setChecking(false)
      }
    }
    check()
    return () => {
      active = false
    }
  }, [session])

  const logout = () => supabase?.auth.signOut()

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-msg">
        <h1>Supabase não configurado</h1>
        <p>Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code> e reinicie o servidor.</p>
        <Link className="admin-link" to="/">← Voltar ao site</Link>
      </div>
    )
  }

  if (!session) return <Login />

  if (checking) return <div className="admin-msg"><p>Carregando…</p></div>

  if (!isAdmin) {
    return (
      <div className="admin-msg">
        <h1>Sem permissão</h1>
        <p>Este usuário não está na lista de admins. Fale com o responsável para liberar seu acesso.</p>
        <button className="btn-admin" onClick={logout}>Sair</button>
      </div>
    )
  }

  return (
    <div className="admin">
      <header className="admin__top">
        <div className="admin__brand">SETOR NORTH · Admin</div>
        <nav className="admin__tabs">
          <button className={tab === 'produtos' ? 'is-active' : ''} onClick={() => setTab('produtos')}>Produtos</button>
          <button className={tab === 'categorias' ? 'is-active' : ''} onClick={() => setTab('categorias')}>Categorias</button>
          <button className={tab === 'inicio' ? 'is-active' : ''} onClick={() => setTab('inicio')}>Início</button>
          <button className={tab === 'drop' ? 'is-active' : ''} onClick={() => setTab('drop')}>Drop</button>
        </nav>
        <div className="admin__right">
          <Link className="admin-link" to="/" target="_blank">Ver site ↗</Link>
          <button className="btn-admin btn-admin--ghost" onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="admin__body">
        {tab === 'produtos' && <ProductsAdmin />}
        {tab === 'categorias' && <CategoriesAdmin />}
        {tab === 'inicio' && <HeroAdmin />}
        {tab === 'drop' && <DropAdmin />}
      </main>
    </div>
  )
}

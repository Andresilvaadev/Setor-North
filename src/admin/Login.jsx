import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError('E-mail ou senha inválidos.')
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <h1>Admin · Setor North</h1>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="admin-login__error">{error}</p>}
        <button className="btn-admin" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <Link className="admin-link" to="/">← Voltar ao site</Link>
      </form>
    </div>
  )
}

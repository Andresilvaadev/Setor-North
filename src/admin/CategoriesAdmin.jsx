import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CategoriesAdmin() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error) setError(error.message)
    setList(data || [])
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError('')
    const sort_order = (list.at(-1)?.sort_order || 0) + 1
    const { error } = await supabase.from('categories').insert({ name: name.trim(), sort_order })
    setBusy(false)
    if (error) setError(error.message)
    else { setName(''); load() }
  }

  const remove = async (c) => {
    if (!confirm(`Excluir categoria "${c.name}"? (os produtos não são apagados)`)) return
    const { error } = await supabase.from('categories').delete().eq('id', c.id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <section className="adm">
      <div className="adm__head"><h2>Categorias ({list.length})</h2></div>
      <p className="adm__note">Não inclua "Todos" — o site adiciona sozinho no filtro.</p>
      {error && <p className="adm__error">{error}</p>}

      <form className="adm__inline" onSubmit={add}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nova categoria (ex.: Calças)" />
        <button className="btn-admin" disabled={busy}>Adicionar</button>
      </form>

      <ul className="adm__chips">
        {list.map((c) => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => remove(c)} aria-label={`Excluir ${c.name}`}>×</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

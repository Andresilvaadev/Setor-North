import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const STATUSES = [
  { v: 'inactive', label: 'Inativo (escondido)' },
  { v: 'comingSoon', label: 'Em breve (cronômetro)' },
  { v: 'live', label: 'Ao vivo (mostra produtos)' },
  { v: 'ended', label: 'Encerrado' },
]

// timestamptz -> valor do input datetime-local
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

export default function DropAdmin() {
  const [row, setRow] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('drop_settings').select('*').eq('id', 1).maybeSingle()
    if (error) setError(error.message)
    setRow(data || { id: 1, status: 'inactive', name: 'DROP 01', tagline: '', release_date: null })
  }, [])

  useEffect(() => { load() }, [load])

  const save = async (e) => {
    e.preventDefault()
    setBusy(true); setError(''); setMsg('')
    const payload = {
      status: row.status,
      name: row.name,
      tagline: row.tagline,
      release_date: row.release_date ? new Date(row.release_date).toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('drop_settings').update(payload).eq('id', 1)
    setBusy(false)
    if (error) setError(error.message)
    else setMsg('Salvo! As mudanças aparecem no site ao recarregar.')
  }

  if (!row) return <p>Carregando…</p>

  return (
    <section className="adm">
      <div className="adm__head"><h2>Controle do Drop</h2></div>
      {error && <p className="adm__error">{error}</p>}
      {msg && <p className="adm__ok">{msg}</p>}

      <form className="adm__form adm__form--inline" onSubmit={save}>
        <label>Estado
          <select value={row.status} onChange={(e) => setRow({ ...row, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
          </select>
        </label>
        <label>Nome<input value={row.name} onChange={(e) => setRow({ ...row, name: e.target.value })} /></label>
        <label>Frase<input value={row.tagline || ''} onChange={(e) => setRow({ ...row, tagline: e.target.value })} /></label>
        <label>Data/hora de lançamento
          <input type="datetime-local" value={toLocalInput(row.release_date)} onChange={(e) => setRow({ ...row, release_date: e.target.value })} />
        </label>
        <p className="adm__note">As peças do Drop são os produtos marcados como "Peça do Drop" na aba Produtos.</p>
        <button className="btn-admin" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
      </form>
    </section>
  )
}

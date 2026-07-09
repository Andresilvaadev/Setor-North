import { useEffect, useState, useCallback } from 'react'
import { supabase, PRODUCT_BUCKET } from '../lib/supabaseClient'

const STATUS = ['disponivel', 'esgotado']

function blank() {
  return {
    id: null, sku: '', name: '', category: '', color: '',
    price: '', promo_price: '', sizes: [], image: '', images: [], status: 'disponivel',
    featured: false, is_drop: false, sort_order: 0,
  }
}

// Garante que o produto sempre tenha um array de imagens (produtos antigos
// só têm o campo "image"; novos usam "images").
function withImages(p) {
  const images = Array.isArray(p.images) && p.images.length
    ? p.images
    : (p.image ? [p.image] : [])
  return { ...p, images }
}

export default function ProductsAdmin() {
  const [list, setList] = useState([])
  const [cats, setCats] = useState([])
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('is_drop').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ])
    if (p.error) setError(p.error.message)
    setList(p.data || [])
    setCats(c.data || [])
  }, [])

  useEffect(() => { load() }, [load])

  const onUpload = async (files) => {
    const list = Array.from(files || [])
    if (!list.length) return
    setUploading(true)
    setError('')
    const uploaded = []
    for (const file of list) {
      const ext = file.name.split('.').pop()
      const rand = Math.random().toString(36).slice(2, 7)
      const path = `${(editing.sku || 'produto').toLowerCase()}-${Date.now()}-${rand}.${ext}`
      const up = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file, { upsert: true })
      if (up.error) {
        setError('Falha no upload: ' + up.error.message)
        setUploading(false)
        return
      }
      const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }
    setEditing((e) => ({ ...e, images: [...(e.images || []), ...uploaded] }))
    setUploading(false)
  }

  // Remove uma imagem da lista do produto em edição
  const removeImage = (url) =>
    setEditing((e) => ({ ...e, images: (e.images || []).filter((u) => u !== url) }))

  // Coloca a imagem escolhida como capa (primeira da lista)
  const makeCover = (url) =>
    setEditing((e) => ({ ...e, images: [url, ...(e.images || []).filter((u) => u !== url)] }))

  const save = async (e) => {
    e.preventDefault()
    if (editing.promo_price !== '' && editing.promo_price !== null &&
        editing.price !== '' && editing.price !== null &&
        Number(editing.promo_price) >= Number(editing.price)) {
      setError('O preço promocional precisa ser menor que o preço normal.')
      return
    }
    setBusy(true)
    setError('')
    const payload = {
      sku: editing.sku.trim(),
      name: editing.name.trim(),
      category: editing.category,
      color: editing.color,
      price: editing.price === '' || editing.price === null ? null : Number(editing.price),
      promo_price: editing.promo_price === '' || editing.promo_price === null ? null : Number(editing.promo_price),
      sizes: editing.sizes,
      images: editing.images || [],
      image: (editing.images && editing.images[0]) || '', // capa = 1ª imagem (compatibilidade)
      status: editing.status,
      featured: editing.featured,
      is_drop: editing.is_drop,
      sort_order: Number(editing.sort_order) || 0,
    }
    let res
    if (editing.id) res = await supabase.from('products').update(payload).eq('id', editing.id)
    else res = await supabase.from('products').insert(payload)
    setBusy(false)
    if (res.error) { setError(res.error.message); return }
    setEditing(null)
    load()
  }

  const remove = async (p) => {
    if (!confirm(`Excluir "${p.name}"?`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) setError(error.message)
    else load()
  }

  const setSizes = (txt) =>
    setEditing((e) => ({ ...e, sizes: txt.split(',').map((s) => s.trim()).filter(Boolean) }))

  return (
    <section className="adm">
      <div className="adm__head">
        <h2>Produtos ({list.length})</h2>
        <button className="btn-admin" onClick={() => setEditing(blank())}>+ Novo produto</button>
      </div>
      {error && <p className="adm__error">{error}</p>}

      <div className="adm__table">
        {list.map((p) => (
          <div className="adm__row" key={p.id}>
            <div className="adm__thumb">
              {p.image ? <img src={p.image} alt="" /> : <span>{p.sku}</span>}
            </div>
            <div className="adm__info">
              <strong>{p.name}</strong>
              <span>{p.sku} · {p.category} · {p.price != null ? `R$ ${Number(p.price).toFixed(2)}` : 'sob consulta'}
                {p.promo_price != null && <> · <strong style={{ color: '#0a0a0a' }}>promo R$ {Number(p.promo_price).toFixed(2)}</strong></>}
              </span>
              <span className="adm__tags">
                {p.is_drop && <em className="tag tag--drop">drop</em>}
                {p.featured && <em className="tag">destaque</em>}
                <em className={`tag ${p.status === 'esgotado' ? 'tag--off' : ''}`}>{p.status}</em>
              </span>
            </div>
            <div className="adm__actions">
              <button onClick={() => setEditing(withImages(p))}>Editar</button>
              <button className="danger" onClick={() => remove(p)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="adm__modal" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="adm__form" onSubmit={save}>
            <h3>{editing.id ? 'Editar produto' : 'Novo produto'}</h3>
            <div className="adm__grid">
              <label>SKU<input value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} required placeholder="SN-CAM-006" /></label>
              <label>Nome<input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></label>
              <label>Categoria
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} required>
                  <option value="">Selecione…</option>
                  {cats.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </label>
              <label>Cor<input value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} /></label>
              <label>Preço (vazio = sob consulta)<input type="number" step="0.01" value={editing.price ?? ''} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></label>
              <label>Preço promocional (vazio = sem promoção)<input type="number" step="0.01" value={editing.promo_price ?? ''} onChange={(e) => setEditing({ ...editing, promo_price: e.target.value })} placeholder="menor que o preço" /></label>
              <label>Tamanhos (separe por vírgula)<input value={editing.sizes.join(', ')} onChange={(e) => setSizes(e.target.value)} placeholder="P, M, G, GG" /></label>
              <label>Status
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label>Ordem<input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} /></label>
            </div>

            <div className="adm__checks">
              <label className="chk"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Destaque</label>
              <label className="chk"><input type="checkbox" checked={editing.is_drop} onChange={(e) => setEditing({ ...editing, is_drop: e.target.checked })} /> Peça do Drop</label>
            </div>

            <div className="adm__images">
              <div className="adm__images-head">
                <strong>Fotos do produto</strong>
                <span className="adm__hint">
                  {(editing.images || []).length
                    ? `${editing.images.length} foto(s) · a 1ª é a capa`
                    : 'Nenhuma foto ainda'}
                </span>
              </div>

              {(editing.images || []).length > 0 && (
                <div className="adm__gallery">
                  {editing.images.map((url, i) => (
                    <div className={`adm__gitem ${i === 0 ? 'adm__gitem--cover' : ''}`} key={url}>
                      <img src={url} alt="" />
                      {i === 0 && <span className="adm__coverbadge">Capa</span>}
                      <div className="adm__gitem-actions">
                        {i !== 0 && (
                          <button type="button" title="Definir como capa" onClick={() => makeCover(url)}>★</button>
                        )}
                        <button type="button" className="danger" title="Remover" onClick={() => removeImage(url)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label className="adm__addphotos">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => { onUpload(e.target.files); e.target.value = '' }}
                />
                <span>+ Adicionar fotos</span>
              </label>
              {uploading && <p>Enviando imagens…</p>}
            </div>

            {error && <p className="adm__error">{error}</p>}
            <div className="adm__formactions">
              <button type="button" className="btn-admin btn-admin--ghost" onClick={() => setEditing(null)}>Cancelar</button>
              <button type="submit" className="btn-admin" disabled={busy || uploading}>{busy ? 'Salvando…' : 'Salvar'}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

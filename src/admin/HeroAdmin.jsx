import { useEffect, useState, useCallback } from 'react'
import { supabase, PRODUCT_BUCKET } from '../lib/supabaseClient'

export default function HeroAdmin() {
  const [images, setImages] = useState([])
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    if (error) { setError(error.message); return }
    setImages(Array.isArray(data?.hero_images) ? data.hero_images : [])
  }, [])

  useEffect(() => { load() }, [load])

  const onUpload = async (files) => {
    const list = Array.from(files || [])
    if (!list.length) return
    setUploading(true); setError(''); setMsg('')
    const uploaded = []
    for (const file of list) {
      const ext = file.name.split('.').pop()
      const rand = Math.random().toString(36).slice(2, 7)
      const path = `hero-${Date.now()}-${rand}.${ext}`
      const up = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file, { upsert: true })
      if (up.error) { setError('Falha no upload: ' + up.error.message); setUploading(false); return }
      const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }
    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  const removeImage = (url) => setImages((prev) => prev.filter((u) => u !== url))
  const makeFirst = (url) => setImages((prev) => [url, ...prev.filter((u) => u !== url)])

  const save = async () => {
    setBusy(true); setError(''); setMsg('')
    const { error } = await supabase
      .from('site_settings')
      .update({ hero_images: images, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setBusy(false)
    if (error) setError(error.message)
    else setMsg('Salvo! As fotos aparecem no site ao recarregar.')
  }

  return (
    <section className="adm">
      <div className="adm__head"><h2>Início (fotos do topo)</h2></div>
      {error && <p className="adm__error">{error}</p>}
      {msg && <p className="adm__ok">{msg}</p>}

      <div className="adm__images">
        <div className="adm__images-head">
          <strong>Fotos do hero</strong>
          <span className="adm__hint">
            {images.length ? `${images.length} foto(s) · o site mostra as 2 primeiras` : 'Nenhuma foto ainda'}
          </span>
        </div>

        {images.length > 0 && (
          <div className="adm__gallery">
            {images.map((url, i) => (
              <div className={`adm__gitem ${i < 2 ? 'adm__gitem--cover' : ''}`} key={url}>
                <img src={url} alt="" />
                {i < 2 && <span className="adm__coverbadge">{i === 0 ? 'Foto 1' : 'Foto 2'}</span>}
                <div className="adm__gitem-actions">
                  {i !== 0 && (
                    <button type="button" title="Mover para o início" onClick={() => makeFirst(url)}>★</button>
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

      <div className="adm__formactions">
        <button className="btn-admin" onClick={save} disabled={busy || uploading}>
          {busy ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </section>
  )
}

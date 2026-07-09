import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import {
  products as seedProducts,
  categories as seedCategories,
  drop as seedDrop,
  hero as seedHero,
} from '../data/siteContent'

const ContentContext = createContext(null)

// --- mapeadores: linha do banco -> formato que os componentes já usam --------
function mapProduct(row) {
  return {
    _id: row.id, // uuid (uso interno/admin)
    id: row.sku, // SKU — usado na UI e na mensagem do WhatsApp
    sku: row.sku,
    name: row.name,
    category: row.category,
    color: row.color || '',
    price: row.price != null ? Number(row.price) : null,
    promoPrice: row.promo_price != null ? Number(row.promo_price) : null,
    sizes: row.sizes || [],
    image: row.image || '',
    images: Array.isArray(row.images) && row.images.length
      ? row.images
      : (row.image ? [row.image] : []),
    status: row.status,
    featured: !!row.featured,
    is_drop: !!row.is_drop,
  }
}

function mapDrop(settings, dropProducts) {
  if (!settings) return seedDrop
  return {
    status: settings.status,
    name: settings.name,
    tagline: settings.tagline,
    releaseDate: settings.release_date,
    products: dropProducts,
  }
}

// Monta o hero final: usa as fotos salvas no admin quando existirem,
// senão mantém as fotos padrão do siteContent.
function mapHero(settings) {
  const imgs = settings && Array.isArray(settings.hero_images) ? settings.hero_images : []
  return { ...seedHero, images: imgs.length ? imgs : seedHero.images }
}

// Estado inicial = fallback (site nunca aparece vazio)
const fallbackState = {
  products: seedProducts.filter((p) => !p.is_drop),
  categories: seedCategories,
  drop: seedDrop,
  hero: seedHero,
  loading: isSupabaseConfigured,
  error: null,
  source: 'fallback',
}

export function ContentProvider({ children }) {
  const [state, setState] = useState(fallbackState)

  const load = useCallback(async () => {
    if (!supabase) {
      setState({ ...fallbackState, loading: false })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    try {
      const [cats, prods, ds, ss] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*').order('sort_order'),
        supabase.from('drop_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      ])
      if (cats.error) throw cats.error
      if (prods.error) throw prods.error
      if (ds.error) throw ds.error
      // site_settings é opcional: se a tabela ainda não existir, seguimos com o padrão
      const siteSettings = ss.error ? null : ss.data

      const allProducts = (prods.data || []).map(mapProduct)
      const catalog = allProducts.filter((p) => !p.is_drop)
      const dropProducts = allProducts.filter((p) => p.is_drop)
      const categories = ['Todos', ...(cats.data || []).map((c) => c.name)]

      setState({
        products: catalog,
        categories,
        drop: mapDrop(ds.data, dropProducts),
        hero: mapHero(siteSettings),
        loading: false,
        error: null,
        source: 'supabase',
      })
    } catch (err) {
      // Em caso de erro, mantém o fallback para não quebrar o site
      console.error('[ContentProvider] erro ao carregar do Supabase:', err)
      setState({ ...fallbackState, loading: false, error: err.message })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <ContentContext.Provider value={{ ...state, reload: load }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent precisa estar dentro de <ContentProvider>')
  return ctx
}

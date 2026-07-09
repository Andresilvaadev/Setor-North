import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Se as variáveis não estiverem configuradas, exportamos null e o site
// continua funcionando com o conteúdo de fallback (siteContent.js).
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

// Nome do bucket de imagens no Storage
export const PRODUCT_BUCKET = 'product-images'

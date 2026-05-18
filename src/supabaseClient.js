import { createClient } from '@supabase/supabase-js'

// 🎯 RECONCILIATION NODE: Ambil kredensial secara aman dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
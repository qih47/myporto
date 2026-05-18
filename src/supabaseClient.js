import { createClient } from '@supabase/supabase-js'

// Ambil URL dan Anon Key dari dashboard Supabase lu (Project Settings > API)
const supabaseUrl = 'https://mbixnhlvccvbgyopahtv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iaXhuaGx2Y2N2Ymd5b3BhaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5ODkwMjAsImV4cCI6MjA4NzU2NTAyMH0.ruYKq6du-ybFwqpRns3nHFXIbG4Ggw-WNsJLdw1xaFw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
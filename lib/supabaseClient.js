// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js"

// Use environment variables (you'll set them in Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

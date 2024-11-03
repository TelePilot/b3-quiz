import { createClient } from '@supabase/supabase-js'
import { SUPA_KEY, SUPA_URL } from 'astro:env/server'
export const prerender = false
export const supabase = createClient(SUPA_URL, SUPA_KEY)

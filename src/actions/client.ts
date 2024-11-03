import { createClient } from '@supabase/supabase-js'
import { SUPA_KEY, SUPA_URL } from 'astro:env/server'

export const prerender = false
export const supabase = createClient(SUPA_URL, SUPA_KEY)
export const createClerkSupaClient = (clerkToken?: string) => {
  return createClient(SUPA_URL, SUPA_KEY, {
    global: {
      // Get the custom Supabase token from Clerk
      fetch: async (url, options = {}) => {
        // Insert the Clerk Supabase token into the headers
        const headers = new Headers(options?.headers)
        headers.set('Authorization', `Bearer ${clerkToken}`)
        // Now call the default fetch
        return fetch(url, {
          ...options,
          headers,
        })
      },
    },
  })
}

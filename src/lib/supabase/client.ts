'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates an authenticated Supabase client for use in Client Components.
 * 
 * @returns A Supabase SSR browser client instance.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) throw new Error('Missing Supabase client vars in browser')

  return createBrowserClient(url, key)
}

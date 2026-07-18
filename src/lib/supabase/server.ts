import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates an authenticated Supabase client for Server Components and Server Actions.
 * 
 * @returns A Supabase SSR client instance configured with user session cookies.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) throw new Error('Missing Supabase client vars')

  return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The catch is ignored because this throws when called from a Server Component.
          }
        },
      },
    },
  )
}

/**
 * Creates a Supabase client with the Service Role Key, bypassing Row Level Security (RLS).
 * MUST ONLY be used in secure server environments for admin tasks.
 * 
 * @returns A Supabase SSR admin client instance.
 */
export async function createAdminClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) throw new Error('Missing Supabase admin vars')

  return createServerClient(url, key, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The catch is ignored because this throws when called from a Server Component.
          }
        },
      },
    },
  )
}

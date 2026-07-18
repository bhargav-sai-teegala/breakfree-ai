'use server'

import { createClient } from '@/lib/supabase/server'
import { LoginSchema, RegisterSchema } from '@/validations/auth'
import { redirect } from 'next/navigation'

export async function loginAction(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      errors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      success: false,
      errors: { general: error.message || 'Invalid email or password' },
    }
  }

  redirect('/dashboard')
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      errors: {
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
    },
  })

  if (error) {
    return {
      success: false,
      errors: { general: error.message || 'Could not create account' },
    }
  }

  // If email confirmation is required, session will be null
  if (!data.session) {
    return {
      success: false,
      errors: {
        general: 'Please check your email and click the confirmation link to complete sign up.',
      },
    }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

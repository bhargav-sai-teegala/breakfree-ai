'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '@/validations/auth'
import { loginAction } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type ActionState = {
  success: boolean
  errors?: {
    email?: string
    password?: string
    general?: string
  }
} | null

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    loginAction,
    null,
  )

  const {
    register,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.errors?.general && (
        <div
          role="alert"
          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400"
        >
          {state.errors.general}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message || state?.errors?.email}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message || state?.errors?.password}
        {...register('password')}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isPending}
        aria-label="Sign in to your account"
        className="mt-2"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

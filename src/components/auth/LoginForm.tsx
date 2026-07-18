'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '@/validations/auth'
import { loginAction } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { OAuthButton } from '@/components/auth/OAuthButton'

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

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-[var(--color-bg-base)] px-2 text-[var(--color-text-muted)] font-semibold">
            Or continue with
          </span>
        </div>
      </div>

      <OAuthButton />
    </form>
  )
}

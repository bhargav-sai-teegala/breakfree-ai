'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, type RegisterInput } from '@/validations/auth'
import { registerAction } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type ActionState = {
  success: boolean
  errors?: {
    name?: string
    email?: string
    password?: string
    general?: string
  }
} | null

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    registerAction,
    null,
  )

  const {
    register,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
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
        label="Your name"
        type="text"
        autoComplete="name"
        placeholder="Alex Smith"
        error={errors.name?.message || state?.errors?.name}
        {...register('name')}
      />

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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        helperText="Must contain at least one letter and one number"
        error={errors.password?.message || state?.errors?.password}
        {...register('password')}
      />

      <p className="text-xs text-[var(--color-text-muted)]">
        By creating an account you agree to our Terms of Service and Privacy Policy.
      </p>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isPending}
        aria-label="Create your account"
        className="mt-2"
      >
        {isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}

import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — BreakFree AI',
}

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Sign in to continue your journey
        </p>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        New here?{' '}
        <Link
          href="/register"
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
        >
          Create your account
        </Link>
      </p>
    </div>
  )
}

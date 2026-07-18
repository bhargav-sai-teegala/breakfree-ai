import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — BreakFree AI',
}

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Start your journey</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Create your free account and break free today
        </p>
      </div>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

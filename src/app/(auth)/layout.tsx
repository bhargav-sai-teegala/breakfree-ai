import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Brand header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-xl" aria-hidden="true">⚡</span>
          </div>
          <span className="text-2xl font-bold text-[var(--color-text-primary)]">
            Break<span className="text-[var(--color-primary)]">Free</span>
          </span>
        </Link>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          AI-powered habit breaking companion
        </p>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8">{children}</div>
      </div>
    </div>
  )
}

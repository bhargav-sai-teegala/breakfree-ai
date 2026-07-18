import Link from 'next/link'
import { Zap, Brain, TrendingUp, Shield, MessageSquare, BarChart3 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BreakFree AI — Break Bad Habits with AI Coaching',
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Coaching',
    description:
      'Gemini 1.5 Flash provides personalized, evidence-based support using CBT and motivational interviewing.',
    color: '#7c3aed',
  },
  {
    icon: Zap,
    title: 'Urge Interceptor',
    description:
      'Real-time AI support when cravings hit. Breathing exercises, distractions, and compassionate recovery.',
    color: '#ef4444',
  },
  {
    icon: TrendingUp,
    title: 'Streak Tracking',
    description:
      'Watch your progress with streaks, milestones, and visual calendars. Every day counts.',
    color: '#f59e0b',
  },
  {
    icon: MessageSquare,
    title: 'Streaming Chat',
    description:
      'Real-time streaming conversations with your AI coach. Always on, always compassionate.',
    color: '#10b981',
  },
  {
    icon: BarChart3,
    title: 'Pattern Insights',
    description:
      'Discover your triggers and patterns. AI analyzes your data to give actionable recommendations.',
    color: '#3b82f6',
  },
  {
    icon: Shield,
    title: 'No Shame Zone',
    description:
      'Relapses are part of recovery. Our AI never judges. Every day is a new start.',
    color: '#ec4899',
  },
]

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
    >
      {/* Nav */}
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow">
            <span className="text-sm" aria-hidden="true">⚡</span>
          </div>
          <span className="text-lg font-bold">
            Break<span style={{ color: 'var(--color-primary)' }}>Free</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124,58,237,0.25) 0%, transparent 65%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              borderColor: 'rgba(124,58,237,0.3)',
              color: 'var(--color-primary)',
            }}
          >
            <Zap className="h-3 w-3" aria-hidden="true" />
            Powered by Google Gemini 1.5 Flash
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Break bad habits.{' '}
            <span style={{ color: 'var(--color-primary)' }}>Build a better life.</span>
          </h1>

          <p
            className="text-xl mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Your AI companion for beating addiction and breaking bad habits. Evidence-based support,
            available 24/7. No shame, just progress.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #6d28d9 100%)',
                boxShadow: '0 0 40px rgba(124,58,237,0.4)',
              }}
            >
              Start your journey — it&apos;s free ⚡
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl font-medium transition-colors border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-bg-surface)',
              }}
            >
              Sign in
            </Link>
          </div>

          <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            No credit card required. Private & secure.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">
            Everything you need to break free
          </h2>
          <p
            className="text-center mb-12 max-w-xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Real AI, real data, real progress. Every feature is backed by science and built
            with compassion.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="glass-card p-6 hover:border-[var(--color-text-muted)] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div
          className="max-w-2xl mx-auto text-center glass-card p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, var(--color-bg-surface) 100%)',
            borderColor: 'rgba(124,58,237,0.3)',
          }}
        >
          <p className="text-4xl font-black mb-4">Ready to break free?</p>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Join thousands changing their lives one day at a time.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Zap className="h-5 w-5" aria-hidden="true" />
            Start today — free forever
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-[var(--color-border)] px-6 py-8 text-center text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <p>BreakFree AI — Built for the Hack2Skill PromptWars Hackathon</p>
        <p className="mt-2">
          If you&apos;re in crisis:{' '}
          <strong style={{ color: 'var(--color-text-secondary)' }}>
            988 Suicide & Crisis Lifeline — call or text 988
          </strong>
        </p>
      </footer>
    </div>
  )
}

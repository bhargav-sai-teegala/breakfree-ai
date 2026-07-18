import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DailyNudgeProps {
  nudge: string
  nudgeType: string
}

export function DailyNudge({ nudge, nudgeType }: DailyNudgeProps) {
  return (
    <div
      className="glass-card p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, var(--color-bg-surface) 60%)',
        borderColor: 'rgba(124,58,237,0.25)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            AI nudge — {nudgeType.replace(/_/g, ' ')}
          </p>
        </div>

        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{nudge}</p>

        <Link
          href="/coach"
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-[var(--color-primary)] hover:underline font-medium"
          aria-label="Continue conversation with AI coach"
        >
          Talk to your coach
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

import Link from 'next/link'

interface DailyNudgeProps {
  nudge: string
  nudgeType: string
}

export function DailyNudge({ nudge, nudgeType }: DailyNudgeProps) {
  return (
    <div
      className="glass-card p-6 relative overflow-hidden flex flex-col justify-between h-full"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)',
      }}
    >
      <div className="relative z-10 flex flex-col h-full">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
          AI INSIGHT · {nudgeType.replace(/_/g, ' ')}
        </p>

        <p className="text-sm text-white leading-relaxed flex-1">
          {nudge}
        </p>

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <Link
            href="/coach"
            className="inline-block text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors font-semibold"
            aria-label="Continue conversation with AI coach"
          >
            Open Chat Terminal ↗
          </Link>
        </div>
      </div>
    </div>
  )
}

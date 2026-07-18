import { getMilestoneEmoji } from '@/lib/utils'
import { Flame } from 'lucide-react'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  habitName: string
}

export function StreakDisplay({ currentStreak, longestStreak, habitName }: StreakDisplayProps) {
  return (
    <div
      className="glass-card p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, var(--color-bg-surface) 60%)',
        borderColor: 'rgba(245,158,11,0.25)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-[var(--color-warm)]" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-warm)]">
            Current streak
          </p>
        </div>

        <div className="flex items-end gap-3">
          <div>
            <p
              className="text-5xl font-black tabular-nums leading-none"
              style={{ color: 'var(--color-warm)' }}
              aria-label={`${currentStreak} day streak`}
            >
              {currentStreak}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              day{currentStreak !== 1 ? 's' : ''} strong
            </p>
          </div>
          <div className="text-3xl pb-1" aria-hidden="true">
            {getMilestoneEmoji(currentStreak)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Best streak</span>
            <span className="font-semibold text-[var(--color-text-secondary)]">
              {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">{habitName}</p>
        </div>
      </div>
    </div>
  )
}

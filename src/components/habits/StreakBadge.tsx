import { cn } from '@/lib/utils'
import { getMilestoneEmoji } from '@/lib/utils'

interface StreakBadgeProps {
  streak: number
  className?: string
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  const variant =
    streak >= 30
      ? 'gold'
      : streak >= 14
        ? 'purple'
        : streak >= 7
          ? 'green'
          : streak >= 1
            ? 'blue'
            : 'neutral'

  const styles: Record<string, string> = {
    gold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    neutral: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0',
        styles[variant],
        className,
      )}
      aria-label={`${streak} day streak`}
    >
      <span aria-hidden="true">{getMilestoneEmoji(streak)}</span>
      {streak}d
    </span>
  )
}

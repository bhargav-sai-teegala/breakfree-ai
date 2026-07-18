import type { Milestone } from '@/types'
import { getMilestoneEmoji } from '@/lib/utils'

interface MilestoneTimelineProps {
  milestones: Milestone[]
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-2 bottom-2 w-px"
        style={{ backgroundColor: 'var(--color-border)' }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-4">
        {milestones.map(milestone => (
          <div key={milestone.id} className="flex items-start gap-4 relative">
            {/* Dot */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-base"
              style={{ backgroundColor: 'var(--color-bg-base)', border: '2px solid var(--color-primary)' }}
              aria-hidden="true"
            >
              {getMilestoneEmoji(milestone.days)}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {milestone.days} day{milestone.days !== 1 ? 's' : ''} streak!
                </p>
                <time
                  dateTime={milestone.achieved_at}
                  className="text-xs text-[var(--color-text-muted)] shrink-0"
                >
                  {new Date(milestone.achieved_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                {milestone.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

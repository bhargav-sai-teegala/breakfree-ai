'use client'

import type { HabitLog } from '@/types'
import { cn } from '@/lib/utils'

interface StreakCalendarProps {
  logs: HabitLog[]
}

export function StreakCalendar({ logs }: StreakCalendarProps) {
  const logMap = new Map(logs.map(l => [l.date, l]))

  // Generate last 60 days
  const days: { date: string; label: string }[] = []
  for (let i = 59; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    days.push({ date: dateStr, label })
  }

  function getCellColor(date: string) {
    const log = logMap.get(date)
    if (!log) return 'bg-[var(--color-bg-elevated)]'
    return log.did_succeed ? 'bg-emerald-500' : 'bg-red-500/60'
  }

  // Split into weeks (rows)
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div>
      {/* Day labels */}
      <div className="flex gap-1.5 mb-1.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div
            key={i}
            className="w-7 h-5 flex items-center justify-center text-[10px] text-[var(--color-text-muted)]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col gap-1.5" role="grid" aria-label="60-day streak calendar">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex gap-1.5" role="row">
            {week.map(({ date, label }) => {
              const log = logMap.get(date)
              const isToday = date === new Date().toISOString().split('T')[0]
              return (
                <div
                  key={date}
                  role="gridcell"
                  aria-label={`${label}: ${log ? (log.did_succeed ? 'success' : 'relapse') : 'no data'}`}
                  title={`${label}: ${log ? (log.did_succeed ? 'Resisted ✓' : 'Gave in ✗') : 'Not logged'}`}
                  className={cn(
                    'w-7 h-7 rounded-md transition-colors',
                    getCellColor(date),
                    isToday && 'ring-2 ring-[var(--color-primary)] ring-offset-1 ring-offset-[var(--color-bg-surface)]',
                  )}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          Resisted
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/60" />
          Gave in
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--color-bg-elevated)]" />
          No log
        </div>
      </div>
    </div>
  )
}

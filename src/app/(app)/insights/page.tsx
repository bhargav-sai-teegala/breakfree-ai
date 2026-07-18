import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateStreak, getSuccessRate, getTopTriggers } from '@/lib/utils'
import { StreakCalendar } from '@/components/insights/StreakCalendar'
import dynamic from 'next/dynamic'

const UrgeIntensityChart = dynamic(() => import('@/components/insights/UrgeIntensityChart').then(mod => mod.UrgeIntensityChart), { loading: () => <div className="h-48 flex items-center justify-center text-sm text-[var(--color-text-muted)]">Loading chart...</div> })
const TriggerBreakdown = dynamic(() => import('@/components/insights/TriggerBreakdown').then(mod => mod.TriggerBreakdown), { loading: () => <div className="h-48 flex items-center justify-center text-sm text-[var(--color-text-muted)]">Loading chart...</div> })
import { AiPatternSummary } from '@/components/insights/AiPatternSummary'
import { MilestoneTimeline } from '@/components/insights/MilestoneTimeline'
import { EmptyState } from '@/components/shared/EmptyState'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights — BreakFree AI',
}

export default async function InsightsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  if (!habits || habits.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Insights</h1>
        <EmptyState
          emoji="📊"
          title="No data yet"
          description="Add a habit and start logging to see your insights."
          action={
            <Link
              href="/habits/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Add first habit
            </Link>
          }
        />
      </div>
    )
  }

  const primaryHabit = habits[0]

  const { data: logs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', primaryHabit.id)
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(90)

  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', user.id)
    .order('achieved_at', { ascending: false })

  const allLogs = logs || []
  const { current: currentStreak, longest: longestStreak } = calculateStreak(allLogs)
  const successRate = getSuccessRate(allLogs, 30)
  const topTriggers = getTopTriggers(allLogs)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Insights</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Showing data for: <strong>{primaryHabit.name}</strong>
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Current streak', value: `${currentStreak}d`, color: 'var(--color-warm)' },
          { label: 'Best streak', value: `${longestStreak}d`, color: 'var(--color-accent)' },
          { label: '30-day rate', value: `${successRate}%`, color: 'var(--color-primary)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className="text-2xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* AI summary */}
      <AiPatternSummary habitId={primaryHabit.id} />

      {/* Streak calendar */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
          60-day calendar
        </h2>
        <StreakCalendar logs={allLogs} />
      </div>

      {/* Urge intensity chart */}
      {allLogs.some(l => l.urge_level) && (
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            Urge intensity over time
          </h2>
          <UrgeIntensityChart logs={allLogs} />
        </div>
      )}

      {/* Trigger breakdown */}
      {topTriggers.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            Top triggers
          </h2>
          <TriggerBreakdown triggers={topTriggers} />
        </div>
      )}

      {/* Milestones */}
      {milestones && milestones.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            Milestones achieved
          </h2>
          <MilestoneTimeline milestones={milestones} />
        </div>
      )}
    </div>
  )
}

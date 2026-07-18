import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateStreak, getTodayString } from '@/lib/utils'
import { generateText } from '@/lib/gemini'
import { buildNudgePrompt } from '@/lib/prompts'
import { WhyCard } from '@/components/dashboard/WhyCard'
import { StreakDisplay } from '@/components/dashboard/StreakDisplay'
import { DailyNudge } from '@/components/dashboard/DailyNudge'
import { UrgeButton } from '@/components/dashboard/UrgeButton'
import { QuickCheckIn } from '@/components/dashboard/QuickCheckIn'
import { EmptyState } from '@/components/shared/EmptyState'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { NudgeType, Habit, HabitLog } from '@/types'

export const metadata: Metadata = {
  title: 'Dashboard — BreakFree AI',
}

// Revalidate every 60s so nudges refresh without full re-build
export const revalidate = 60

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userName = (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'there'
  const today = getTodayString()

  // Fetch active habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  if (!habits || habits.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Welcome, {userName}!
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Ready to break free?</p>
        </div>
        <EmptyState
          emoji="⚡"
          title="Let's start your journey"
          description="Add your first habit to break and get personalized AI support."
          action={
            <Link
              href="/habits/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Add your first habit
            </Link>
          }
        />
      </div>
    )
  }

  const primaryHabit = habits[0]

  // Fetch logs and today's nudge in parallel — eliminates waterfall
  const [{ data: recentLogs }, { data: nudge }] = await Promise.all([
    supabase
      .from('habit_logs')
      .select('id, habit_id, user_id, date, did_succeed, urge_level, triggers, mood, note, logged_at')
      .eq('habit_id', primaryHabit.id)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30),
    supabase
      .from('nudges')
      .select('id, content, type, date')
      .eq('habit_id', primaryHabit.id)
      .eq('user_id', user.id)
      .eq('date', today)
      .single(),
  ])

  const logs = recentLogs || []
  const { current: currentStreak, longest: longestStreak } = calculateStreak(logs)
  const todayLog = logs.find(l => l.date === today) ?? null

  // Auto-generate nudge if none exists for today
  let todayNudge = nudge
  if (!todayNudge) {
    try {
      const nudgeType: NudgeType =
        currentStreak >= 30 ? 'milestone_celebration' :
        currentStreak >= 7 ? 'momentum_builder' :
        (logs[0] && !logs[0].did_succeed) ? 'recovery_encouragement' :
        'motivational_encouragement'

      const prompt = buildNudgePrompt(primaryHabit as Habit, logs as HabitLog[], currentStreak, nudgeType)
      const content = await generateText(prompt) || 'Every day you show up is a win. You\'ve got this.'

      const { data: newNudge } = await supabase
        .from('nudges')
        .upsert({ habit_id: primaryHabit.id, user_id: user.id, content, type: nudgeType, date: today }, { onConflict: 'habit_id,date' })
        .select('id, content, type, date')
        .single()

      todayNudge = newNudge
    } catch { /* nudge generation fails gracefully */ }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {greeting}, {userName}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            {todayLog
              ? todayLog.did_succeed
                ? 'You checked in today. Keep it up!'
                : 'You had a tough day. Tomorrow is a new start.'
              : "Don't forget to check in today."}
          </p>
        </div>
        {habits.length > 1 && (
          <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2 py-1 rounded-lg">
            {habits.length} habits
          </span>
        )}
      </div>

      {/* Urge help CTA */}
      <UrgeButton />

      {/* Streak + Why */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StreakDisplay
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          habitName={primaryHabit.name}
        />
        <WhyCard motivation={primaryHabit.motivation} habitName={primaryHabit.name} />
      </div>

      {/* AI Nudge */}
      {todayNudge && <DailyNudge nudge={todayNudge.content} nudgeType={todayNudge.type} />}

      {/* Quick check-in */}
      <QuickCheckIn habit={primaryHabit} todayLog={todayLog} today={today} />

      {/* Other habits summary */}
      {habits.length > 1 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">All habits</h2>
            <Link
              href="/habits"
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {habits.slice(1).map(habit => (
              <div
                key={habit.id}
                className="flex items-center justify-between py-2 border-t border-[var(--color-border)] first:border-0"
              >
                <span className="text-sm text-[var(--color-text-secondary)]">{habit.name}</span>
                <Link
                  href={`/log?habit=${habit.id}`}
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  Log
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

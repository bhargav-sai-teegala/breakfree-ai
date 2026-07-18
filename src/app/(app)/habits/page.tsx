import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateStreak } from '@/lib/utils'
import { HabitCard } from '@/components/habits/HabitCard'
import { EmptyState } from '@/components/shared/EmptyState'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Habits — BreakFree AI',
}

export default async function HabitsPage() {
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

  // Fetch logs for each habit to compute streaks
  const habitsWithStreaks = await Promise.all(
    (habits || []).map(async habit => {
      const { data: logs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habit.id)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(60)

      const { current, longest } = calculateStreak(logs || [])
      return { ...habit, currentStreak: current, longestStreak: longest }
    }),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">My habits</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            {habitsWithStreaks.length} active habit{habitsWithStreaks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/habits/new"
          aria-label="Add new habit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add habit
        </Link>
      </div>

      {habitsWithStreaks.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Add your first habit to break. Our AI will guide you every step of the way."
          action={
            <Link
              href="/habits/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              ADD YOUR FIRST HABIT
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {habitsWithStreaks.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              currentStreak={habit.currentStreak}
              longestStreak={habit.longestStreak}
            />
          ))}
        </div>
      )}
    </div>
  )
}

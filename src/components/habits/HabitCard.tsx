'use client'

import { useTransition } from 'react'
import { motion } from 'framer-motion'
import { Archive, Target } from 'lucide-react'
import type { Habit } from '@/types'
import { HABIT_CATEGORIES } from '@/types'
import { archiveHabitAction } from '@/app/actions/habits'
import { StreakBadge } from './StreakBadge'
import Link from 'next/link'

interface HabitCardProps {
  habit: Habit
  currentStreak: number
  longestStreak: number
}

export function HabitCard({ habit, currentStreak, longestStreak }: HabitCardProps) {
  const [isPending, startTransition] = useTransition()
  const categoryInfo = HABIT_CATEGORIES[habit.category]

  function handleArchive() {
    if (!confirm('Archive this habit? You can still see your history.')) return
    startTransition(() => archiveHabitAction(habit.id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-4 hover:border-[var(--color-text-muted)] transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0" aria-hidden="true">
            {categoryInfo.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {habit.name}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">{categoryInfo.label}</p>
          </div>
        </div>
        <StreakBadge streak={currentStreak} />
      </div>

      {/* Goal */}
      <div className="flex items-center gap-2">
        <Target className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" aria-hidden="true" />
        <span className="text-xs text-[var(--color-text-secondary)]">
          Goal:{' '}
          {habit.target_type === 'eliminate'
            ? 'Eliminate completely'
            : `Reduce to ${habit.target_value} ${habit.unit}/day`}
        </span>
      </div>

      {/* Motivation snippet */}
      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 italic">
        &ldquo;{habit.motivation}&rdquo;
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs border-t border-[var(--color-border)] pt-3">
        <div className="flex flex-col">
          <span className="text-[var(--color-text-muted)]">Current</span>
          <span className="font-semibold text-[var(--color-warm)]">{currentStreak}d streak</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[var(--color-text-muted)]">Best</span>
          <span className="font-semibold text-[var(--color-text-secondary)]">{longestStreak}d</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Link
            href={`/log?habit=${habit.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
            aria-label={`Log check-in for ${habit.name}`}
          >
            Log today
          </Link>
          <button
            onClick={handleArchive}
            disabled={isPending}
            aria-label={`Archive ${habit.name}`}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Archive className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

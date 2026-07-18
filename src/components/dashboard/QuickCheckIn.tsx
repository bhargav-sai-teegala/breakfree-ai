'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import type { Habit, HabitLog } from '@/types'
import { createLogAction } from '@/app/actions/habits'

interface QuickCheckInProps {
  habit: Habit
  todayLog: HabitLog | null
  today: string
}

export function QuickCheckIn({ habit, todayLog, today }: QuickCheckInProps) {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(!!todayLog)
  const [result, setResult] = useState<boolean | null>(todayLog?.did_succeed ?? null)

  const hour = new Date().getHours()
  if (hour < 18 && !todayLog) return null

  function handleCheckIn(didSucceed: boolean) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('habit_id', habit.id)
      formData.set('date', today)
      formData.set('did_succeed', String(didSucceed))
      formData.set('triggers', JSON.stringify([]))
      await createLogAction(null, formData)
      setResult(didSucceed)
      setSubmitted(true)
    })
  }

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.div
          key="checkin"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="glass-card p-5"
        >
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
            Daily check-in
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            How did you do with &ldquo;{habit.name}&rdquo; today?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleCheckIn(true)}
              disabled={isPending}
              aria-label="I resisted today"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: 'var(--color-accent)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              I resisted!
            </button>
            <button
              onClick={() => handleCheckIn(false)}
              disabled={isPending}
              aria-label="I gave in today"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Gave in
            </button>
          </div>
          <p className="text-xs text-center text-[var(--color-text-muted)] mt-3">
            No judgment — honest tracking helps you improve
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex items-center gap-4"
          style={{
            borderColor: result ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)',
          }}
        >
          {result ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Logged!</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  You resisted today. Every win counts.
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-red-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Logged</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Tomorrow is a new start. You&apos;ve got this.
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

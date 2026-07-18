'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
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
          className="glass-card p-6 border-zinc-800 bg-[#0a0a0a]"
        >
          <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-zinc-400 mb-2">
            DAILY CHECK-IN
          </h2>
          <p className="text-base text-white mb-6">
            How did you do with &ldquo;{habit.name}&rdquo; today?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleCheckIn(true)}
              disabled={isPending}
              aria-label="I resisted today"
              className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 border"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)' }}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mb-1" />
              ) : (
                <span className="text-xl font-black mb-1">✓</span>
              )}
              <span className="text-xs font-bold uppercase tracking-wide">RESISTED</span>
            </button>
            <button
              onClick={() => handleCheckIn(false)}
              disabled={isPending}
              aria-label="I gave in today"
              className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 border"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mb-1" />
              ) : (
                <span className="text-xl font-black mb-1">✕</span>
              )}
              <span className="text-xs font-bold uppercase tracking-wide">GAVE IN</span>
            </button>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-center text-zinc-600 mt-4 font-semibold">
            Honesty builds progress
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex items-center gap-5 border-zinc-800 bg-[#0a0a0a]"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black border"
            style={{
              color: result ? '#10b981' : '#ef4444',
              backgroundColor: result ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              borderColor: result ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
            }}
          >
            {result ? '✓' : '✕'}
          </div>
          <div>
            <p className="font-bold text-white text-lg tracking-tight mb-1">LOGGED</p>
            <p className="text-sm text-zinc-400">
              {result ? 'You resisted today. Excellent work.' : 'Tomorrow is a new day. Keep going.'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

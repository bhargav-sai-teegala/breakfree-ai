'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { createLogAction } from '@/app/actions/habits'
import { getTodayString } from '@/lib/utils'
import { TRIGGER_LABELS, type Habit, type TriggerType } from '@/types'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function LogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const habitIdParam = searchParams.get('habit')

  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [didSucceed, setDidSucceed] = useState<boolean | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [urgeLevel, setUrgeLevel] = useState(3)
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')

  const today = getTodayString()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          const all = data || []
          setHabits(all)
          if (habitIdParam) {
            setSelectedHabit(all.find(h => h.id === habitIdParam) || all[0] || null)
          } else {
            setSelectedHabit(all[0] || null)
          }
          setLoading(false)
        })
    })
  }, [habitIdParam])

  function toggleTrigger(key: string) {
    setTriggers(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key],
    )
  }

  async function handleSubmit() {
    if (!selectedHabit || didSucceed === null) return
    setIsPending(true)

    const formData = new FormData()
    formData.set('habit_id', selectedHabit.id)
    formData.set('date', today)
    formData.set('did_succeed', String(didSucceed))
    formData.set('triggers', JSON.stringify(triggers))
    formData.set('urge_level', String(urgeLevel))
    formData.set('mood', String(mood))
    if (note.trim()) formData.set('note', note.trim())

    await createLogAction(null, formData)
    setSubmitted(true)
    setIsPending(false)
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-24" />
      </div>
    )
  }

  if (!selectedHabit) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-[var(--color-text-secondary)]">
          No habits found.{' '}
          <Link href="/habits/new" className="text-[var(--color-primary)]">
            Add one first.
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-6"
          >
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-3"
              >
                <ArrowLeft className="h-3 w-3" />
                Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Daily check-in</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Habit selector */}
            {habits.length > 1 && (
              <div>
                <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-2">
                  Habit
                </label>
                <select
                  value={selectedHabit.id}
                  onChange={e => {
                    const h = habits.find(h => h.id === e.target.value)
                    if (h) setSelectedHabit(h)
                  }}
                  aria-label="Select habit to log"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {habits.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Success/fail choice */}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                How did today go with <strong>&ldquo;{selectedHabit.name}&rdquo;</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDidSucceed(true)}
                  aria-pressed={didSucceed === true}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-semibold transition-all',
                    didSucceed === true
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-emerald-500/50',
                  )}
                >
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  I resisted!
                </button>
                <button
                  onClick={() => setDidSucceed(false)}
                  aria-pressed={didSucceed === false}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-semibold transition-all',
                    didSucceed === false
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-red-500/30',
                  )}
                >
                  <XCircle className="h-6 w-6" aria-hidden="true" />
                  Gave in
                </button>
              </div>
            </div>

            {/* Triggers */}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                What triggered you today?{' '}
                <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Today's triggers">
                {(Object.entries(TRIGGER_LABELS) as [TriggerType, { label: string; emoji: string }][]).map(
                  ([key, { label, emoji }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleTrigger(key)}
                      aria-pressed={triggers.includes(key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all',
                        triggers.includes(key)
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]',
                      )}
                    >
                      <span aria-hidden="true">{emoji}</span>
                      {label}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-4">
              <Slider
                value={urgeLevel}
                onChange={setUrgeLevel}
                min={1}
                max={5}
                label="Urge intensity"
                showLabels
                minLabel="Low"
                maxLabel="High"
              />
              <Slider
                value={mood}
                onChange={setMood}
                min={1}
                max={5}
                label="Mood today"
                showLabels
                minLabel="Low"
                maxLabel="High"
              />
            </div>

            {/* Note */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="note"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                Journal note{' '}
                <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
              </label>
              <textarea
                id="note"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Anything you want to remember about today..."
                className="w-full px-4 py-2.5 rounded-xl text-sm resize-none bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <p className="text-xs text-[var(--color-text-muted)] text-right">
                {note.length}/500
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              loading={isPending}
              disabled={didSucceed === null}
              fullWidth
              size="lg"
              aria-label="Save today's check-in"
            >
              {isPending ? 'Saving…' : 'Save check-in'}
            </Button>

            <p className="text-xs text-center text-[var(--color-text-muted)]">
              Honest logging is the foundation of lasting change.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-6 py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-6xl"
              aria-hidden="true"
            >
              {didSucceed ? '🎉' : '💙'}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {didSucceed ? 'Logged! Great work.' : 'Logged. That took courage.'}
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-2 text-sm">
                {didSucceed
                  ? 'Every day you resist, you rewire your brain. Keep going.'
                  : "You showed up and logged it. That honesty is how you'll change."}
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              aria-label="Return to dashboard"
            >
              Back to dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

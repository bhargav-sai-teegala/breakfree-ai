'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { TriggerPicker } from '@/components/urge/TriggerPicker'
import { IntensitySlider } from '@/components/urge/IntensitySlider'
import { BreathingExercise } from '@/components/urge/BreathingExercise'
import { DistractionList } from '@/components/urge/DistractionList'
import { RelapseRecovery } from '@/components/urge/RelapseRecovery'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import type { Habit } from '@/types'

type Step = 'select-habit' | 'assess' | 'breathe' | 'distractions' | 'relapse'

export default function UrgePage() {
  const [step, setStep] = useState<Step>('select-habit')
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [intensity, setIntensity] = useState(3)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .then(({ data }) => {
          setHabits(data || [])
          if (data?.length === 1) setSelectedHabit(data[0])
          setLoading(false)
        })
    })
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-20" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {/* Step: select habit */}
        {step === 'select-habit' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Emergency Intercept
              </h1>
              <p className="text-zinc-400 mt-2 text-sm font-medium">
                Let's work through this urge together. Which habit are you struggling with right now?
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {habits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => {
                    setSelectedHabit(habit)
                    setStep('assess')
                  }}
                  className="text-left glass-card p-6 flex flex-col gap-1 border-zinc-800 bg-[#111] hover:bg-[#1a1a1a] transition-all active:scale-95 group"
                  aria-label={`Get help with ${habit.name}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-white group-hover:text-white">{habit.name}</p>
                    <span className="text-zinc-600 group-hover:text-white transition-colors">↗</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{habit.category}</p>
                </button>
              ))}
              {habits.length === 0 && (
                <div className="glass-card p-8 text-center border-zinc-800 bg-[#111]">
                  <p className="text-zinc-500 font-medium">No active habits found.</p>
                </div>
              )}
            </div>

            <p className="text-[10px] uppercase tracking-widest font-bold text-center text-zinc-600">
              Urges typically pass in 5–20 minutes. Ride the wave.
            </p>
          </motion.div>
        )}

        {/* Step: assess */}
        {step === 'assess' && selectedHabit && (
          <motion.div
            key="assess"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex flex-col gap-6"
          >
            <div>
              <button
                onClick={() => setStep('select-habit')}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-2 flex items-center gap-1"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                What&apos;s happening right now?
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                For: <strong>{selectedHabit.name}</strong>
              </p>
            </div>

            <TriggerPicker selected={triggers} onChange={setTriggers} />
            <IntensitySlider value={intensity} onChange={setIntensity} />

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setStep('breathe')}
                size="lg"
                fullWidth
                aria-label="Start breathing exercise"
              >
                Help me breathe through it
              </Button>
              <Button
                onClick={() => setStep('distractions')}
                variant="secondary"
                size="lg"
                fullWidth
                aria-label="Show distractions to help"
              >
                Show me distractions
              </Button>
              <Button
                onClick={() => setStep('relapse')}
                variant="ghost"
                size="lg"
                fullWidth
                aria-label="I already gave in"
              >
                I already gave in...
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: breathe */}
        {step === 'breathe' && selectedHabit && (
          <motion.div
            key="breathe"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <div>
              <button
                onClick={() => setStep('assess')}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-2"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Let&apos;s breathe together
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                The 4-7-8 technique reduces anxiety in minutes.
              </p>
            </div>

            <BreathingExercise />

            <Button
              onClick={() => setStep('distractions')}
              variant="secondary"
              fullWidth
              aria-label="I feel calmer, show me what to do next"
            >
              I feel calmer — what next?
            </Button>
          </motion.div>
        )}

        {/* Step: distractions */}
        {step === 'distractions' && selectedHabit && (
          <motion.div
            key="distractions"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex flex-col gap-6"
          >
            <div>
              <button
                onClick={() => setStep('assess')}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-2"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Try this instead
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                AI-suggested replacements for this moment.
              </p>
            </div>

            <DistractionList habit={selectedHabit} triggers={triggers} />
          </motion.div>
        )}

        {/* Step: relapse recovery */}
        {step === 'relapse' && selectedHabit && (
          <motion.div
            key="relapse"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <div className="mb-4">
              <button
                onClick={() => setStep('assess')}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-2"
              >
                ← Back
              </button>
            </div>
            <RelapseRecovery habit={selectedHabit} triggers={triggers} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

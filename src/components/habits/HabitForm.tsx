'use client'

import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateHabitSchema, type CreateHabitInput } from '@/validations/habit'
import { createHabitAction } from '@/app/actions/habits'
import { HABIT_CATEGORIES } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActionState = {
  success: boolean
  errors?: Record<string, string | undefined>
} | null

const STEPS = ['Category', 'Goal', 'Motivation'] as const
type Step = 0 | 1 | 2

export function HabitForm() {
  const [step, setStep] = useState<Step>(0)
  const [isPending, startTransition] = useTransition()
  const [actionState, setActionState] = useState<ActionState>(null)

  const {
    register,
    setValue,
    trigger,
    getValues,
    control,
    formState: { errors },
  } = useForm<CreateHabitInput>({
    resolver: zodResolver(CreateHabitSchema),
    defaultValues: {
      target_type: 'eliminate',
    },
  })

  const category = useWatch({ control, name: 'category' })
  const targetType = useWatch({ control, name: 'target_type' })

  async function goNext() {
    const fields: (keyof CreateHabitInput)[] =
      step === 0 ? ['category', 'name'] : step === 1 ? ['target_type'] : ['motivation']
    const ok = await trigger(fields)
    if (ok) setStep(s => Math.min(2, s + 1) as Step)
  }

  function goPrev() {
    setStep(s => Math.max(0, s - 1) as Step)
  }

  // Build FormData from react-hook-form state — NOT from DOM,
  // because AnimatePresence unmounts previous steps before submission.
  function handleSubmit() {
    const values = getValues()
    const formData = new FormData()
    formData.set('name', values.name ?? '')
    formData.set('category', values.category ?? '')
    formData.set('motivation', values.motivation ?? '')
    formData.set('target_type', values.target_type ?? 'eliminate')
    if (values.target_value != null) formData.set('target_value', String(values.target_value))
    if (values.unit) formData.set('unit', values.unit)

    startTransition(async () => {
      const state = await createHabitAction(null, formData)
      if (state && !state.success) setActionState(state)
    })
  }

  const categories = Object.entries(HABIT_CATEGORIES) as [
    keyof typeof HABIT_CATEGORIES,
    { label: string; emoji: string; color: string },
  ][]

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2" aria-label="Form progress">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all',
                i < step
                  ? 'bg-[var(--color-accent)] text-white'
                  : i === step
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]',
              )}
              aria-current={i === step ? 'step' : undefined}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                i === step ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]',
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px w-6 transition-colors',
                  i < step ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]',
                )}
              />
            )}
          </div>
        ))}
      </div>

      {actionState?.errors && (
        <div role="alert" className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {Object.values(actionState.errors).filter(Boolean).join('. ')}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 0: Category + Name */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                What are you working on?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(([key, { label, emoji }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue('category', key)}
                    aria-pressed={category === key}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left',
                      category === key
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]',
                    )}
                  >
                    <span aria-hidden="true">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p role="alert" className="mt-1 text-xs text-[var(--color-danger)]">
                  {errors.category.message}
                </p>
              )}
            </div>

            <Input
              label="Name this habit specifically"
              placeholder='e.g., "Scroll Instagram before bed"'
              error={errors.name?.message}
              {...register('name')}
            />
          </motion.div>
        )}

        {/* Step 1: Goal */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                What&apos;s your goal?
              </p>
              <div className="flex gap-3">
                {(['eliminate', 'reduce'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue('target_type', type)}
                    aria-pressed={targetType === type}
                    className={cn(
                      'flex-1 py-3 rounded-xl border text-sm font-medium transition-all',
                      targetType === type
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]',
                    )}
                  >
                    {type === 'eliminate' ? '🚫 Eliminate completely' : '📉 Reduce gradually'}
                  </button>
                ))}
              </div>
            </div>

            {targetType === 'reduce' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex gap-3"
              >
                <Input
                  label="Target amount"
                  type="number"
                  min="0"
                  placeholder="e.g., 30"
                  error={errors.target_value?.message}
                  className="flex-1"
                  {...register('target_value', { valueAsNumber: true })}
                />
                <Input
                  label="Unit"
                  placeholder="minutes, times..."
                  error={errors.unit?.message}
                  className="flex-1"
                  {...register('unit')}
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 2: Motivation */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="motivation"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                Why do you want to break this habit?
              </label>
              <p className="text-xs text-[var(--color-text-muted)]">
                This is your personal WHY. The AI will reference it to keep you motivated.
              </p>
              <textarea
                id="motivation"
                rows={4}
                placeholder="I want to break this because..."
                aria-invalid={!!errors.motivation}
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl text-sm resize-none',
                  'bg-[var(--color-bg-elevated)] border text-[var(--color-text-primary)]',
                  'placeholder:text-[var(--color-text-muted)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                  errors.motivation
                    ? 'border-[var(--color-danger)]'
                    : 'border-[var(--color-border)]',
                )}
                {...register('motivation')}
              />
              {errors.motivation && (
                <p role="alert" className="text-xs text-[var(--color-danger)]">
                  {errors.motivation.message}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="secondary" onClick={goPrev} className="flex-1">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" onClick={goNext} className="flex-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" loading={isPending} fullWidth={step === 0} className="flex-1">
            {isPending ? 'Creating…' : 'Start breaking free ⚡'}
          </Button>
        )}
      </div>
    </form>
  )
}

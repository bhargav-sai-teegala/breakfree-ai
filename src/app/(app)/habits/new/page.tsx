import { HabitForm } from '@/components/habits/HabitForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add New Habit — BreakFree AI',
}

export default function NewHabitPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Add a habit to break</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Tell us what you want to work on — our AI will personalize your journey.
        </p>
      </div>
      <HabitForm />
    </div>
  )
}

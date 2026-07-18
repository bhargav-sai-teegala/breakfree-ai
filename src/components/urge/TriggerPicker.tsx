'use client'

import { TRIGGER_LABELS, type TriggerType } from '@/types'
import { cn } from '@/lib/utils'

interface TriggerPickerProps {
  selected: string[]
  onChange: (triggers: string[]) => void
}

export function TriggerPicker({ selected, onChange }: TriggerPickerProps) {
  const triggers = Object.entries(TRIGGER_LABELS) as [
    TriggerType,
    { label: string; emoji: string },
  ][]

  function toggle(key: string) {
    if (selected.includes(key)) {
      onChange(selected.filter(t => t !== key))
    } else {
      onChange([...selected, key])
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
        What&apos;s triggering this urge?{' '}
        <span className="text-[var(--color-text-muted)] font-normal">(select all that apply)</span>
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Trigger selection">
        {triggers.map(([key, { label, emoji }]) => {
          const isSelected = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              aria-pressed={isSelected}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all active:scale-95',
                isSelected
                  ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--color-text-primary)]'
                  : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]',
              )}
            >
              <span aria-hidden="true">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

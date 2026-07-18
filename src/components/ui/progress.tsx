'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  label?: string
  showValue?: boolean
}

export function Progress({ value, max = 100, className, label, showValue = false }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="flex flex-col gap-1">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-medium text-[var(--color-text-primary)]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        value={pct}
        max={100}
        aria-label={label || `Progress: ${Math.round(pct)}%`}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-elevated)]',
          className,
        )}
      >
        <ProgressPrimitive.Indicator
          style={{ transform: `translateX(-${100 - pct}%)` }}
          className="h-full w-full rounded-full bg-[var(--color-primary)] transition-transform duration-500 ease-out"
        />
      </ProgressPrimitive.Root>
    </div>
  )
}

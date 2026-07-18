'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  className?: string
  showLabels?: boolean
  minLabel?: string
  maxLabel?: string
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  label,
  className,
  showLabels = false,
  minLabel,
  maxLabel,
}: SliderProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
          <span className="text-sm font-bold text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] px-2 py-0.5 rounded-lg">
            {value}/{max}
          </span>
        </div>
      )}
      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        aria-label={label || 'Slider'}
        className="relative flex items-center select-none touch-none w-full h-5"
      >
        <SliderPrimitive.Track className="bg-[var(--color-bg-elevated)] relative grow rounded-full h-2 border border-[var(--color-border)]">
          <SliderPrimitive.Range className="absolute bg-[var(--color-primary)] rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg border-2 border-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] cursor-grab active:cursor-grabbing transition-transform hover:scale-110" />
      </SliderPrimitive.Root>
      {showLabels && (minLabel || maxLabel) && (
        <div className="flex justify-between">
          <span className="text-xs text-[var(--color-text-muted)]">{minLabel || min}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{maxLabel || max}</span>
        </div>
      )}
    </div>
  )
}

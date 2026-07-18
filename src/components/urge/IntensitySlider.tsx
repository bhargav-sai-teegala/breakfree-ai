'use client'

import { Slider } from '@/components/ui/slider'

interface IntensitySliderProps {
  value: number
  onChange: (value: number) => void
}

const intensityLabels: Record<number, string> = {
  1: 'Just a whisper',
  2: 'Noticeable',
  3: 'Pulling at me',
  4: 'Very strong',
  5: 'Overwhelming',
}

const intensityColors: Record<number, string> = {
  1: '#10b981',
  2: '#84cc16',
  3: '#f59e0b',
  4: '#f97316',
  5: '#ef4444',
}

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          How intense is the urge?
        </p>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-lg"
          style={{
            color: intensityColors[value],
            backgroundColor: `${intensityColors[value]}20`,
          }}
          aria-live="polite"
          aria-label={`Urge intensity: ${intensityLabels[value]}`}
        >
          {intensityLabels[value]}
        </span>
      </div>
      <Slider
        value={value}
        onChange={onChange}
        min={1}
        max={5}
        step={1}
        showLabels
        minLabel="Mild"
        maxLabel="Overwhelming"
        aria-label="Urge intensity from 1 to 5"
      />
    </div>
  )
}

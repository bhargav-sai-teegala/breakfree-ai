'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { HabitLog } from '@/types'
import { formatDate } from '@/lib/utils'

interface UrgeIntensityChartProps {
  logs: HabitLog[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-[var(--color-text-muted)]">{label}</p>
      <p className="font-semibold text-[var(--color-primary)]">
        Intensity: {payload[0].value}/5
      </p>
    </div>
  )
}

export function UrgeIntensityChart({ logs }: UrgeIntensityChartProps) {
  const chartData = logs
    .filter(l => l.urge_level !== null)
    .slice(0, 30)
    .reverse()
    .map(l => ({
      date: formatDate(l.date),
      intensity: l.urge_level,
    }))

  if (chartData.length < 2) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
        Log more check-ins with urge levels to see this chart.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="intensity"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'var(--color-primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

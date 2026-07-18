'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TRIGGER_LABELS, type TriggerType } from '@/types'

interface TriggerBreakdownProps {
  triggers: { trigger: string; count: number }[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const info = TRIGGER_LABELS[label as TriggerType]
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-[var(--color-text-muted)]">
        {info ? `${info.emoji} ${info.label}` : label}
      </p>
      <p className="font-semibold text-[var(--color-warning)]">
        {payload[0].value} time{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#3b82f6']

export function TriggerBreakdown({ triggers }: TriggerBreakdownProps) {
  const chartData = triggers.slice(0, 6).map(({ trigger, count }) => {
    const info = TRIGGER_LABELS[trigger as TriggerType]
    return {
      name: info ? info.label : trigger,
      count,
    }
  })

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
        No trigger data yet. Log check-ins to see patterns.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: -20 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--color-text-muted)', fontSize: 9 }}
          tickLine={false}
          axisLine={false}
          angle={-30}
          textAnchor="end"
        />
        <YAxis
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

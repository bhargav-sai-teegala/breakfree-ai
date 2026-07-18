'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import type { InsightData } from '@/types'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'

interface AiPatternSummaryProps {
  habitId: string
}

export function AiPatternSummary({ habitId }: AiPatternSummaryProps) {
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/ai/insights?habitId=${habitId}`)
      .then(r => r.json())
      .then((data: InsightData) => {
        setInsights(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [habitId])

  if (loading) {
    return (
      <div className="glass-card p-5 flex flex-col gap-3">
        <LoadingSkeleton className="h-5 w-40" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-5/6" />
        <LoadingSkeleton className="h-4 w-4/6" />
      </div>
    )
  }

  if (error || !insights) {
    return null
  }

  const riskBadge = {
    low: 'success' as const,
    medium: 'warning' as const,
    high: 'danger' as const,
  }[insights.riskLevel]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
      style={{ borderColor: 'rgba(124,58,237,0.25)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Analysis</h2>
        </div>
        <Badge variant={riskBadge}>
          {insights.riskLevel} risk
        </Badge>
      </div>

      {/* Score */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="var(--color-bg-elevated)"
              strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeDasharray={`${insights.overallScore} 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black text-[var(--color-text-primary)]">
              {insights.overallScore}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{insights.headline}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{insights.topInsight}</p>
        </div>
      </div>

      {/* Patterns */}
      <div className="flex flex-col gap-2 mb-4">
        {insights.patterns.map((pattern, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
            <TrendingUp className="h-3 w-3 mt-0.5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
            {pattern}
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div
        className="rounded-xl p-3 text-xs text-[var(--color-text-secondary)]"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      >
        <span className="font-semibold text-[var(--color-text-primary)]">This week: </span>
        {insights.recommendation}
      </div>

      {/* Encouragement */}
      <p className="text-xs text-[var(--color-text-muted)] mt-3 italic text-center">
        {insights.encouragement}
      </p>
    </motion.div>
  )
}

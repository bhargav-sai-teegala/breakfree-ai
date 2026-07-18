'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import type { Habit } from '@/types'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'

interface DistractionListProps {
  habit: Habit
  triggers: string[]
}

const FALLBACK_SUGGESTIONS = [
  'Do 10 slow, deep squats while breathing deeply through your nose.',
  'Splash cold water on your face and hold a cool cloth against your wrists for 30 seconds.',
  'Text or call someone you care about — just to say hi.',
  'Step outside for fresh air and notice 5 things you can see around you.',
  'Write in a journal for 5 minutes about how you\'ll feel proud tomorrow.',
]

export function DistractionList({ habit, triggers }: DistractionListProps) {
  const [suggestion, setSuggestion] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [fallbackIdx, setFallbackIdx] = useState(0)

  async function fetchSuggestion() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/replacement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: habit.category,
          motivation: habit.motivation,
          triggers,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json() as { suggestion: string }
      setSuggestion(data.suggestion)
    } catch {
      setSuggestion(FALLBACK_SUGGESTIONS[fallbackIdx % FALLBACK_SUGGESTIONS.length])
      setFallbackIdx(i => i + 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSuggestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card p-6 relative overflow-hidden" style={{ borderColor: 'rgba(124,58,237,0.3)' }}>
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.06) 0%, transparent 70%)' }}
        />
        <div className="flex items-start gap-3 relative">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(124,58,237,0.15)' }}
          >
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
              Try this right now
            </p>
            {loading ? (
              <LoadingSkeleton className="h-16 w-full" />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[var(--color-text-primary)] leading-relaxed"
              >
                {suggestion}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={fetchSuggestion}
        disabled={loading}
        aria-label="Get another suggestion"
        className="self-center"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
        Different idea
      </Button>

      {/* Remember your why */}
      <div className="glass-card p-4" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <p className="text-xs font-semibold text-[var(--color-warm)] mb-1">Remember your why</p>
        <p className="text-sm text-[var(--color-text-secondary)] italic line-clamp-2">
          &ldquo;{habit.motivation}&rdquo;
        </p>
      </div>

      <p className="text-xs text-center text-[var(--color-text-muted)] px-4">
        Urges peak and pass. Most last only 5–20 minutes. Ride the wave.
      </p>
    </div>
  )
}

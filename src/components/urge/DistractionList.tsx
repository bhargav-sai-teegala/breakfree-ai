'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
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

  const fetchSuggestion = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
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
  }, [fallbackIdx, habit.category, habit.motivation, triggers])

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestion(true), 0)
    return () => clearTimeout(t)
  }, [fetchSuggestion])

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card p-6 relative overflow-hidden flex flex-col h-full bg-[#0a0a0a] border-zinc-800">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
          ACTIONABLE DISTRACTION
        </p>
        <div className="flex-1">
          {loading ? (
            <LoadingSkeleton className="h-16 w-full" />
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base text-white leading-relaxed font-medium"
            >
              {suggestion}
            </motion.p>
          )}
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={() => fetchSuggestion(false)}
        disabled={loading}
        aria-label="Get another suggestion"
        className="w-full uppercase tracking-widest text-xs font-bold py-6 hover:bg-white hover:text-black border-zinc-800"
      >
        {loading ? 'GENERATING...' : 'REQUEST NEW IDEA'}
      </Button>

      {/* Remember your why */}
      <div className="p-4 border-l-2 border-white/20 mt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Core Motivation</p>
        <p className="text-base text-white italic font-serif leading-relaxed">
          &ldquo;{habit.motivation}&rdquo;
        </p>
      </div>

      <p className="text-xs text-center text-zinc-600 px-4 font-semibold uppercase tracking-widest mt-4">
        Urges peak and pass. Ride the wave.
      </p>
    </div>
  )
}

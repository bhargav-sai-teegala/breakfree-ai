'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import type { Habit } from '@/types'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import Link from 'next/link'

interface RelapseRecoveryProps {
  habit: Habit
  triggers: string[]
}

const FALLBACK_MESSAGE = `What happened today doesn't erase your progress. Every person in recovery has moments like this — it doesn't mean you've failed.

The most important thing right now is to be kind to yourself. Self-criticism doesn't help; self-compassion does.

Take one small step tonight: get a good night's sleep. Tomorrow, you start fresh. Your brain is literally rewiring itself every day you try, and that work doesn't disappear.

You reached out for help instead of ignoring this — that's strength.`

export function RelapseRecovery({ habit, triggers }: RelapseRecoveryProps) {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessage() {
      try {
        const res = await fetch('/api/ai/relapse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habitId: habit.id,
            triggers,
          }),
        })
        if (!res.ok) throw new Error('API error')
        const data = await res.json() as { message: string }
        setMessage(data.message)
      } catch {
        setMessage(FALLBACK_MESSAGE)
      } finally {
        setLoading(false)
      }
    }
    fetchMessage()
  }, [habit.id, triggers])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div
        className="glass-card p-6 relative overflow-hidden"
        style={{ borderColor: 'rgba(245,158,11,0.25)' }}
      >
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        />
        <div className="flex items-start gap-3 relative">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}
          >
            <Heart className="h-5 w-5 text-[var(--color-warm)]" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-warm)] mb-3">
              From your AI coach
            </p>
            {loading ? (
              <div className="flex flex-col gap-2">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-5/6" />
                <LoadingSkeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm text-[var(--color-text-primary)] leading-relaxed mb-3 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={`/log?habit=${habit.id}&relapse=true`}
          className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-text-muted)] transition-colors"
          aria-label="Log today honestly"
        >
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Log today honestly</p>
            <p className="text-xs text-[var(--color-text-muted)]">Honest data helps you improve</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
        </Link>

        <Link
          href="/coach"
          className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/50 transition-colors"
          aria-label="Talk to AI coach for support"
        >
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Talk to your coach</p>
            <p className="text-xs text-[var(--color-text-muted)]">Deeper support, anytime</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
        </Link>
      </div>

      <p className="text-xs text-center text-[var(--color-text-muted)] px-4">
        If you&apos;re struggling with serious thoughts, please reach out: 988 Suicide & Crisis Lifeline (call or text 988)
      </p>
    </motion.div>
  )
}

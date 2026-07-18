'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
      <div className="glass-card p-6 border-zinc-800 bg-[#0a0a0a]">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
          FROM YOUR AI COACH
        </p>
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col gap-3">
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
                  className="text-sm text-white leading-relaxed mb-4 last:mb-0 font-medium"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href={`/log?habit=${habit.id}&relapse=true`}
          className="flex items-center justify-between px-6 py-5 rounded-xl border border-zinc-800 bg-[#111] hover:border-zinc-500 transition-colors"
          aria-label="Log today honestly"
        >
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">LOG HONESTLY</p>
            <p className="text-xs text-zinc-500 tracking-widest uppercase">Honest data builds strength</p>
          </div>
          <span className="text-white font-black tracking-widest">↗</span>
        </Link>

        <Link
          href="/coach"
          className="flex items-center justify-between px-6 py-5 rounded-xl border border-zinc-800 bg-white text-black hover:bg-zinc-200 transition-colors"
          aria-label="Talk to AI coach for support"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-wider mb-1">OPEN COACH TERMINAL</p>
            <p className="text-xs text-zinc-700 tracking-widest uppercase">Deeper support, anytime</p>
          </div>
          <span className="font-black tracking-widest">↗</span>
        </Link>
      </div>

      <p className="text-[10px] text-center text-zinc-600 px-4 uppercase tracking-widest font-semibold mt-4">
        If you're in crisis: Call or text 988 (Suicide & Crisis Lifeline)
      </p>
    </motion.div>
  )
}

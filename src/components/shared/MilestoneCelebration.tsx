'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMilestoneEmoji } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MilestoneCelebrationProps {
  days: number
  message: string
  onDismiss: () => void
}

export function MilestoneCelebration({ days, message, onDismiss }: MilestoneCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899']
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    )
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        role="dialog"
        aria-modal="true"
        aria-label={`Milestone celebration: ${days} days`}
      >
        {/* Confetti particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{ backgroundColor: p.color, left: `${p.x}%`, top: '-10px' }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
              opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'easeIn',
            }}
          />
        ))}

        {/* Card */}
        <motion.div
          initial={{ scale: 0.5, y: 60 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass-card p-8 max-w-sm w-full text-center relative"
          style={{ borderColor: 'var(--color-primary)', borderWidth: 2 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 2 }}
            className="text-6xl mb-4"
            aria-hidden="true"
          >
            {getMilestoneEmoji(days)}
          </motion.div>

          <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
            {days} Day{days !== 1 ? 's' : ''}!
          </h2>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
            {message}
          </p>

          <Button onClick={onDismiss} fullWidth size="lg" aria-label="Continue your journey">
            Keep going! 🔥
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

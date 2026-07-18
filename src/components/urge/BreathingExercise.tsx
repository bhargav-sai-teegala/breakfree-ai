'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest'

const PHASES: { phase: Phase; duration: number; label: string; color: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Breathe in...', color: '#7c3aed' },
  { phase: 'hold', duration: 7, label: 'Hold...', color: '#f59e0b' },
  { phase: 'exhale', duration: 8, label: 'Breathe out...', color: '#10b981' },
  { phase: 'rest', duration: 2, label: 'Rest...', color: '#4b5563' },
]

export function BreathingExercise() {
  const [active, setActive] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [countdown, setCountdown] = useState(PHASES[0].duration)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!active) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) return prev - 1

        setPhaseIdx(pi => {
          const next = (pi + 1) % PHASES.length
          if (next === 0) setCycles(c => c + 1)
          return next
        })
        return PHASES[(phaseIdx + 1) % PHASES.length].duration
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [active, phaseIdx])

  const currentPhase = PHASES[phaseIdx]
  
  // Hold phase should maintain the inhaled size, Rest phase should maintain the exhaled size
  const scale = 
    (currentPhase.phase === 'inhale' || currentPhase.phase === 'hold') ? 1.4 :
    (currentPhase.phase === 'exhale' || currentPhase.phase === 'rest') ? 0.7 : 1

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      {/* Circle */}
      <div className="relative flex items-center justify-center" aria-live="polite" aria-label={`Breathing: ${currentPhase.label} ${countdown} seconds`}>
        {active && (
          <motion.div
            key={`bg-${phaseIdx}`}
            className="absolute rounded-full opacity-20"
            style={{ backgroundColor: currentPhase.color, width: 200, height: 200 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
          />
        )}
        <motion.div
          className="rounded-full flex items-center justify-center cursor-pointer select-none"
          style={{
            width: 160,
            height: 160,
            backgroundColor: active ? `${currentPhase.color}30` : 'var(--color-bg-elevated)',
            border: `3px solid ${active ? currentPhase.color : 'var(--color-border)'}`,
          }}
          animate={active ? { scale } : { scale: 1 }}
          transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
          onClick={() => {
            if (!active) {
              setActive(true)
              setPhaseIdx(0)
              setCountdown(PHASES[0].duration)
              setCycles(0)
            }
          }}
        >
          <div className="text-center">
            {active ? (
              <>
                <p className="text-4xl font-black tabular-nums" style={{ color: currentPhase.color }}>
                  {countdown}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phaseIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs font-medium mt-1"
                    style={{ color: currentPhase.color }}
                  >
                    {currentPhase.label}
                  </motion.p>
                </AnimatePresence>
              </>
            ) : (
              <div className="text-center px-4">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Tap to start</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">4-7-8 breathing</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {active ? (
            <>
              Cycle{' '}
              <span className="font-bold text-[var(--color-text-primary)]">{cycles + 1}</span> of 3
              {' '}
              {cycles >= 2 && '✓'}
            </>
          ) : (
            'This breathing pattern activates your parasympathetic nervous system.'
          )}
        </p>
        {cycles >= 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-emerald-400 font-medium mt-1"
          >
            Great work! Your nervous system is calming down.
          </motion.p>
        )}
      </div>

      {/* Phase guide */}
      <div className="flex gap-4 text-center">
        {PHASES.filter(p => p.phase !== 'rest').map(({ phase, duration, label, color }) => (
          <div key={phase} className="flex flex-col items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: active && currentPhase.phase === phase ? color : 'var(--color-border)' }}
            />
            <p className="text-xs text-[var(--color-text-muted)]">{duration}s</p>
            <p className="text-xs text-[var(--color-text-muted)]">{label.replace('...', '')}</p>
          </div>
        ))}
      </div>

      {active && (
        <button
          onClick={() => { setActive(false); setPhaseIdx(0); setCountdown(PHASES[0].duration); setCycles(0) }}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] underline"
          aria-label="Stop breathing exercise"
        >
          Stop
        </button>
      )}
    </div>
  )
}

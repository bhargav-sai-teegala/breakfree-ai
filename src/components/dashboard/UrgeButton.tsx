'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function UrgeButton() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <button
        onClick={() => router.push('/urge')}
        className="w-full urge-pulse rounded-2xl py-5 flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%)',
        }}
        aria-label="Get immediate help with an urge"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="h-6 w-6 text-white" aria-hidden="true" />
          </motion.div>
          <span className="text-xl font-black text-white tracking-wide">FEELING AN URGE?</span>
          <Zap className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <span className="text-sm text-red-100 font-medium">Tap for immediate help →</span>
      </button>
    </motion.div>
  )
}

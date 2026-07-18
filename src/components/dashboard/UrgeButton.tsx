'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
        className="glass-card w-full rounded-2xl py-6 flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 group border-red-900/30 bg-[#111] hover:bg-[#151111] hover:border-red-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
        aria-label="Get immediate help with an urge"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
          <span className="text-xl font-bold text-white tracking-widest uppercase">EMERGENCY INTERCEPT</span>
        </div>
        <span className="text-xs text-red-400/80 font-medium tracking-wider uppercase">Tap for immediate support</span>
      </button>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatInterface } from '@/components/coach/ChatInterface'
import type { CoachMessage } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, X } from 'lucide-react'

import { useCoach } from '@/contexts/CoachContext'

export function FloatingAura() {
  const { isOpen, closeCoach, toggleCoach } = useCoach()
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [habitId, setHabitId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !loading) return

    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: msgs }, { data: habits }] = await Promise.all([
        supabase
          .from('coach_messages')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'chat')
          .order('created_at', { ascending: true })
          .limit(50),
        supabase
          .from('habits')
          .select('id')
          .eq('user_id', user.id)
          .is('archived_at', null)
          .limit(1)
          .single(),
      ])

      setMessages(msgs || [])
      setHabitId(habits?.id || null)
      setLoading(false)
    }

    init()
  }, [isOpen, loading])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-4 md:bottom-[90px] md:right-8 z-50 w-[calc(100vw-32px)] md:w-[360px] h-[480px] max-h-[calc(100vh-140px)] rounded-3xl flex flex-col overflow-hidden bg-gradient-to-b from-[#1a1a1a]/95 to-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(255,255,255,0.05)] ring-1 ring-white/5"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-white/[0.08] to-transparent shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <h2 className="text-xs font-black tracking-[0.2em] uppercase text-white/90">Aura</h2>
              </div>
              <button
                onClick={closeCoach}
                className="text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                aria-label="Close Aura"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col p-4">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Sparkles className="w-6 h-6 text-white/50 animate-pulse" />
                    <p className="text-xs text-white/50 tracking-widest uppercase font-medium">Connecting...</p>
                  </div>
                </div>
              ) : (
                <ChatInterface initialMessages={messages} habitId={habitId} isPopup />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleCoach}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all duration-300"
        aria-label="Toggle Aura AI Coach"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
      </motion.button>
    </>
  )
}

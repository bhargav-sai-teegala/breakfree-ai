'use client'

import { motion } from 'framer-motion'
import type { CoachMessage } from '@/types'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'

interface MessageBubbleProps {
  message: CoachMessage
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-0.5 bg-[#111] border border-[#333]"
          aria-hidden="true"
        >
          <Logo size={16} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg',
          isUser
            ? 'rounded-br-sm bg-white text-black font-medium'
            : 'rounded-bl-sm text-white glass-card',
        )}
      >
        {message.content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>
            {line}
          </p>
        ))}
        {isStreaming && (
          <span
            className="inline-block w-1.5 h-4 ml-1 bg-white animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import type { CoachMessage } from '@/types'
import { cn } from '@/lib/utils'

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
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mb-0.5"
          style={{ backgroundColor: 'var(--color-primary)' }}
          aria-hidden="true"
        >
          ⚡
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm text-white'
            : 'rounded-bl-sm text-[var(--color-text-primary)] glass-card',
        )}
        style={
          isUser
            ? { backgroundColor: 'var(--color-primary)' }
            : {}
        }
      >
        {message.content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>
            {line}
          </p>
        ))}
        {isStreaming && (
          <span
            className="inline-block w-0.5 h-4 ml-0.5 bg-[var(--color-text-secondary)] animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </div>
    </motion.div>
  )
}

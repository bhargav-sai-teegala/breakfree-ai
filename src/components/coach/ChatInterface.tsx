'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CoachMessage } from '@/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

const WELCOME_MESSAGE: CoachMessage = {
  id: 'welcome',
  user_id: '',
  role: 'model',
  content: "Hi! I'm your BreakFree AI coach. I'm here to support you on your journey — whether you need encouragement, help with a craving, or just someone to talk to. What's on your mind today?",
  habit_id: null,
  type: 'chat',
  created_at: new Date().toISOString(),
}

interface ChatInterfaceProps {
  initialMessages: CoachMessage[]
  habitId: string | null
}

export function ChatInterface({ initialMessages, habitId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<CoachMessage[]>(
    initialMessages.length > 0 ? initialMessages : [WELCOME_MESSAGE],
  )
  const [streamingContent, setStreamingContent] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, scrollToBottom])

  async function handleSend(content: string) {
    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      user_id: '',
      role: 'user',
      content,
      habit_id: habitId,
      type: 'chat',
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setIsStreaming(true)
    setStreamingContent('')

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          habitId,
          history: messages
            .filter(m => m.id !== 'welcome')
            .slice(-10)
            .map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        // Parse SSE
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data) as { text?: string }
              if (parsed.text) {
                accumulated += parsed.text
                setStreamingContent(accumulated)
              }
            } catch {
              // Not JSON, fall back to raw text
            }
          }
        }
      }

      const aiMsg: CoachMessage = {
        id: `ai-${Date.now()}`,
        user_id: '',
        role: 'model',
        content: accumulated || 'I\'m here with you. Could you tell me more?',
        habit_id: habitId,
        type: 'chat',
        created_at: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiMsg])
      setStreamingContent('')
    } catch {
      const errorMsg: CoachMessage = {
        id: `err-${Date.now()}`,
        user_id: '',
        role: 'model',
        content: 'I had trouble connecting. Please try again — I\'m here for you.',
        habit_id: habitId,
        type: 'chat',
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
      setStreamingContent('')
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <MessageBubble
            key="streaming"
            message={{
              id: 'streaming',
              user_id: '',
              role: 'model',
              content: streamingContent,
              habit_id: null,
              type: 'chat',
              created_at: new Date().toISOString(),
            }}
            isStreaming
          />
        )}

        {/* Typing indicator */}
        {isStreaming && !streamingContent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs shrink-0">
              ⚡
            </div>
            <div className="glass-card px-4 py-3">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[var(--color-text-muted)]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 pt-3 border-t border-[var(--color-border)]">
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="flex items-end gap-2 px-1 pb-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Message Aura..."
        aria-label="Message your AI coach"
        className={cn(
          'flex-1 resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed',
          'bg-white/5 border border-white/10 shadow-inner backdrop-blur-md',
          'text-white placeholder:text-white/40',
          'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 focus:bg-white/10',
          'transition-all max-h-32 overflow-y-auto',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          'w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 border shadow-lg',
          canSend
            ? 'bg-white text-black border-transparent hover:scale-105 active:scale-95'
            : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed',
        )}
      >
        <Send className="h-4 w-4 ml-0.5" aria-hidden="true" />
      </button>
    </div>
  )
}

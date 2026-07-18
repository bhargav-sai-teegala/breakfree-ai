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
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Message your coach… (Enter to send, Shift+Enter for newline)"
        aria-label="Message your AI coach"
        className={cn(
          'flex-1 resize-none rounded-xl px-4 py-3 text-sm',
          'bg-[var(--color-bg-elevated)] border border-[var(--color-border)]',
          'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'transition-colors max-h-40 overflow-y-auto',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0',
          canSend
            ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-95'
            : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed',
        )}
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

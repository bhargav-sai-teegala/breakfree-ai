'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'default'

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (opts: { title: string; description?: string; type?: ToastType }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, type = 'default' }: { title: string; description?: string; type?: ToastType }) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { id, title, description, type }])
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map(t => (
          <ToastPrimitive.Root
            key={t.id}
            open={true}
            onOpenChange={open => { if (!open) dismiss(t.id) }}
            duration={4000}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border shadow-2xl',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
              'data-[state=closed]:slide-out-to-right-full',
              'data-[state=open]:slide-in-from-top-full',
              t.type === 'success' && 'bg-[var(--color-bg-surface)] border-emerald-500/40',
              t.type === 'error' && 'bg-[var(--color-bg-surface)] border-red-500/40',
              t.type === 'default' && 'bg-[var(--color-bg-surface)] border-[var(--color-border)]',
            )}
          >
            <div className="flex-1 min-w-0">
              <ToastPrimitive.Title
                className={cn(
                  'text-sm font-semibold',
                  t.type === 'success' && 'text-emerald-400',
                  t.type === 'error' && 'text-red-400',
                  t.type === 'default' && 'text-[var(--color-text-primary)]',
                )}
              >
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

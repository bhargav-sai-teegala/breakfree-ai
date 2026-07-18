import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 flex flex-col items-center text-center gap-4">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        aria-hidden="true"
      >
        {emoji}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-xs">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

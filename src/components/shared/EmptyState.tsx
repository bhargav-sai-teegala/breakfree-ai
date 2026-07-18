import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-6 border-dashed border-zinc-800 bg-[#0a0a0a]">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-widest uppercase text-white">{title}</h2>
        <p className="text-sm font-medium tracking-wide text-zinc-500 max-w-sm mx-auto">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

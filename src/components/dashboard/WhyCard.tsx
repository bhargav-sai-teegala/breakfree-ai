import { Heart } from 'lucide-react'

interface WhyCardProps {
  motivation: string
  habitName: string
}

export function WhyCard({ motivation, habitName }: WhyCardProps) {
  return (
    <div
      className="glass-card p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, var(--color-bg-surface) 60%)',
        borderColor: 'rgba(245,158,11,0.25)',
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--color-warm), transparent)' }}
      />

      <div className="flex items-start gap-3 relative">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}
        >
          <Heart className="h-4 w-4 text-[var(--color-warm)]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-warm)] mb-1">
            Why you started
          </p>
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed line-clamp-3">
            &ldquo;{motivation}&rdquo;
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">For: {habitName}</p>
        </div>
      </div>
    </div>
  )
}

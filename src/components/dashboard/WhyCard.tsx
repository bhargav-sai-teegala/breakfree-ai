interface WhyCardProps {
  motivation: string
  habitName: string
}

export function WhyCard({ motivation, habitName }: WhyCardProps) {
  return (
    <div
      className="glass-card p-6 relative overflow-hidden flex flex-col justify-between h-full"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)',
      }}
    >
      <div className="relative z-10 flex flex-col h-full">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
          Core Motivation
        </p>

        <div className="flex-1 flex items-center">
          <p className="text-lg text-white font-serif italic leading-relaxed border-l-2 border-white/20 pl-4 py-1">
            "{motivation}"
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Fueling: <span className="text-white font-semibold">{habitName}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

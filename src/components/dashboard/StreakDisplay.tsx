interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  habitName: string
}

export function StreakDisplay({ currentStreak, longestStreak, habitName }: StreakDisplayProps) {
  return (
    <div
      className="glass-card p-6 relative overflow-hidden flex flex-col justify-between h-full"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)',
      }}
    >
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
          Current Streak
        </p>

        <div className="flex items-baseline gap-2 mb-2">
          <p
            className="text-6xl font-black tabular-nums tracking-tighter"
            style={{ color: 'white' }}
            aria-label={`${currentStreak} day streak`}
          >
            {currentStreak}
          </p>
          <p className="text-lg text-zinc-500 font-medium">
            day{currentStreak !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Best Record</span>
            <span className="font-semibold text-white">
              {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-zinc-600 mt-2 truncate">{habitName}</p>
        </div>
      </div>
    </div>
  )
}

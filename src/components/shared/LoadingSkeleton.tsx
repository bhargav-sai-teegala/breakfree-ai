import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('skeleton', className)} aria-hidden="true" />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3" aria-busy="true" aria-label="Loading...">
      <div className="skeleton h-5 w-32" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/6" />
      <div className="skeleton h-10 w-full mt-2" />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading...">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Flame, Zap, MessageSquare, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/urge', label: 'HELP', icon: Zap, isUrge: true },
  { href: '/coach', label: 'Coach', icon: MessageSquare },
  { href: '/insights', label: 'Stats', icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] flex items-center justify-around px-2 h-16 safe-area-inset-bottom"
      style={{ backgroundColor: 'var(--color-bg-surface)' }}
      aria-label="Mobile navigation"
    >
      {navItems.map(({ href, label, icon: Icon, isUrge }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        if (isUrge) {
          return (
            <Link
              key={href}
              href={href}
              aria-label="Get urge help now"
              className="-mt-6 flex flex-col items-center justify-center"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-2xl',
                  'bg-[var(--color-danger)] urge-pulse',
                  isActive && 'scale-95',
                )}
              >
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-[10px] mt-1 font-bold text-[var(--color-danger)]">{label}</span>
            </Link>
          )
        }
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-12 py-1 rounded-lg transition-colors',
              isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

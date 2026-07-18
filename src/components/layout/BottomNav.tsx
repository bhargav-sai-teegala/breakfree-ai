'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/habits', label: 'Habits' },
  { href: '/urge', label: 'SOS', isUrge: true },
  { href: '/coach', label: 'Coach' },
  { href: '/insights', label: 'Stats' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 flex items-center justify-around px-2 h-16 safe-area-inset-bottom bg-[#0a0a0a]/90 backdrop-blur-xl"
      aria-label="Mobile navigation"
    >
      {navItems.map(({ href, label, isUrge }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        if (isUrge) {
          return (
            <Link
              key={href}
              href={href}
              aria-label="Get urge help now"
              className="-mt-6 flex flex-col items-center justify-center group"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300',
                  'bg-white/10 border border-white/20 group-hover:bg-white/20',
                  isActive && 'scale-95',
                )}
              >
                <span className="text-white font-medium text-xs leading-none">SOS</span>
              </div>
            </Link>
          )
        }
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center px-3 py-2 transition-all rounded-lg',
              isActive
                ? 'text-white bg-white/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5',
            )}
          >
            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

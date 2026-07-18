'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/habits', label: 'Habits' },
  { href: '/urge', label: 'Crisis Mode', isUrge: true },
  { href: '/insights', label: 'Stats' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 flex items-center justify-around px-2 h-16 safe-area-inset-bottom bg-[#0a0a0a]/90 backdrop-blur-xl"
      aria-label="Mobile navigation"
    >
      {navItems.map(item => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href!))
        if (item.isUrge) {
          return (
            <Link
              key={item.href}
              href={item.href!}
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
                <span className="text-white font-medium text-[9px] tracking-widest leading-none text-center px-1">CRISIS<br/>MODE</span>
              </div>
            </Link>
          )
        }
        return (
          <Link
            key={item.href}
            href={item.href!}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center px-3 py-2 transition-all rounded-lg',
              isActive
                ? 'text-white bg-white/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5',
            )}
          >
            <span className="text-[11px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

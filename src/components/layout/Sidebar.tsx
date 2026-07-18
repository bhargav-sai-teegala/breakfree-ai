'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/actions/auth'
import { useTransition } from 'react'
import { Logo } from '@/components/shared/Logo'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/habits', label: 'Habits' },
  { href: '/urge', label: 'Crisis Mode' },
  { href: '/insights', label: 'Insights' },
  { href: '/profile', label: 'Profile' },
]

interface SidebarProps {
  userName: string
  userEmail: string
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 h-screen bg-[#0a0a0a] border-r border-white/5"
      aria-label="Sidebar navigation"
    >
      {/* Brand */}
      <div className="px-6 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-3">
          <Logo size={24} className="text-white" />
          <span className="text-xl font-semibold tracking-tight text-white/90">
            BreakFree
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Sidebar navigation">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href!))
          return (
            <Link
              key={item.href}
              href={item.href!}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium transition-all rounded-xl',
                isActive
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4">
        <div className="flex flex-col gap-0.5 px-3 mb-4">
          <p className="text-sm font-medium text-white/90 truncate">{userName}</p>
          <p className="text-xs text-white/50 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isPending}
          aria-label="Sign out"
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150',
            'text-white/60 hover:text-white/90 hover:bg-white/5',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isPending ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/actions/auth'
import { useTransition } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/habits', label: 'Habits' },
  { href: '/urge', label: 'Emergency Help' },
  { href: '/coach', label: 'AI Coach' },
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
        <Link href="/dashboard" className="inline-flex items-center">
          <span className="text-xl font-semibold tracking-tight text-white/90">
            BreakFree
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/5',
              )}
            >
              <span>{label}</span>
              {href === '/urge' && (
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" aria-hidden="true" />
              )}
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

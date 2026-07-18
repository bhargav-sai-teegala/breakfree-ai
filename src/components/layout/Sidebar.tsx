'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Flame, Zap, MessageSquare, BarChart3, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/actions/auth'
import { useTransition } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/habits', label: 'My Habits', icon: Flame },
  { href: '/urge', label: 'Urge Help', icon: Zap },
  { href: '/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
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
      className="hidden md:flex flex-col w-64 shrink-0 border-r border-[var(--color-border)] h-screen"
      style={{ backgroundColor: 'var(--color-bg-surface)' }}
      aria-label="Sidebar navigation"
    >
      {/* Brand */}
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow group-hover:scale-105 transition-transform">
            <span className="text-sm" aria-hidden="true">⚡</span>
          </div>
          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            Break<span className="text-[var(--color-primary)]">Free</span>
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-purple-900/40'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
              {href === '/urge' && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-[var(--color-danger)]" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            aria-hidden="true"
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{userName}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isPending}
          aria-label="Sign out"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-danger)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}

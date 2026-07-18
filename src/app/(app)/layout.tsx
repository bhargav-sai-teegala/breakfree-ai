import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import type { ReactNode } from 'react'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const userName = (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'there'
  const userEmail = user.email || ''

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      {/* Desktop sidebar */}
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main content */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto pb-20 md:pb-0"
        aria-label="Main content"
      >
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-8">{children}</div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}

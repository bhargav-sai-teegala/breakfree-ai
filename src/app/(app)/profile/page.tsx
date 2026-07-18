import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile — BreakFree AI',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userName = (user.user_metadata?.name as string) || 'User'
  const userEmail = user.email || ''

  const { count: habitCount } = await supabase
    .from('habits')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('archived_at', null)

  const { count: logCount } = await supabase
    .from('habit_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: milestoneCount } = await supabase
    .from('milestones')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Profile</h1>

      {/* User card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
            aria-hidden="true"
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{userName}</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">{userEmail}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Member since {memberSince}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Active habits', value: habitCount ?? 0 },
            { label: 'Days logged', value: logCount ?? 0 },
            { label: 'Milestones', value: milestoneCount ?? 0 },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: 'var(--color-bg-elevated)' }}
            >
              <p className="text-2xl font-black text-[var(--color-text-primary)]">{value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">About BreakFree AI</h3>
        <div className="flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
          <p>
            BreakFree AI uses Google Gemini 1.5 Flash for personalized coaching, evidence-based CBT techniques, and motivational interviewing to help you build lasting change.
          </p>
          <p>
            All your data is private and encrypted. AI responses are generated in real-time based on your actual habit history.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass-card p-6" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Account</h3>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="danger"
            fullWidth
            aria-label="Sign out of your account"
          >
            Sign out
          </Button>
        </form>
      </div>

      {/* Crisis line */}
      <div
        className="rounded-xl p-4 text-xs text-center text-[var(--color-text-muted)]"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      >
        If you&apos;re in crisis, please reach out immediately:{' '}
        <strong className="text-[var(--color-text-secondary)]">
          988 Suicide & Crisis Lifeline — call or text 988
        </strong>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatInterface } from '@/components/coach/ChatInterface'
import type { CoachMessage } from '@/types'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

export default function CoachPage() {
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [habitId, setHabitId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: msgs }, { data: habits }] = await Promise.all([
        supabase
          .from('coach_messages')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'chat')
          .order('created_at', { ascending: true })
          .limit(50),
        supabase
          .from('habits')
          .select('id')
          .eq('user_id', user.id)
          .is('archived_at', null)
          .limit(1)
          .single(),
      ])

      setMessages(msgs || [])
      setHabitId(habits?.id || null)
      setLoading(false)
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto h-[calc(100vh-8rem)]">
        <LoadingSkeleton className="h-8 w-48" />
        <div className="flex-1 flex flex-col gap-3 justify-end">
          <LoadingSkeleton className="h-16 w-3/4" />
          <LoadingSkeleton className="h-12 w-1/2 self-end" />
          <LoadingSkeleton className="h-16 w-2/3" />
        </div>
        <LoadingSkeleton className="h-14" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">AI Coach</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Your empathetic companion, always here to help.
        </p>
      </div>
      <ChatInterface initialMessages={messages} habitId={habitId} />
    </div>
  )
}

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini'
import { buildNudgePrompt } from '@/lib/prompts'
import { calculateStreak } from '@/lib/utils'
import type { NudgeType } from '@/types'

function determineNudgeType(streak: number, lastSuccess: boolean | null): NudgeType {
  if (streak >= 30) return 'milestone_celebration'
  if (streak >= 7) return 'momentum_builder'
  if (lastSuccess === false) return 'recovery_encouragement'
  if (streak === 0) return 'motivational_encouragement'
  return 'momentum_builder'
}

const FALLBACK_NUDGES: Record<NudgeType, string> = {
  milestone_celebration: "You've built an incredible streak. Every day you chose yourself, you rewired your brain for success. Keep this momentum going — you're proving you can do hard things.",
  momentum_builder: "You're on a roll! Each day you resist, your brain gets a little better at saying no. That's not willpower — that's neuroscience working in your favor.",
  recovery_encouragement: "Yesterday is done. Today is new. The strongest people in recovery aren't those who never slip — they're the ones who get back up. Today, that's you.",
  gentle_warning: "It's been a few days since you logged in. No judgment — life gets busy. But your journey matters. Even a quick check-in today keeps the momentum alive.",
  stress_preparation: "Stressful times test us most. If you feel the urge today, remember: the craving lasts 20 minutes max. You just need to outlast it.",
  motivational_encouragement: "Every single person who has overcome a bad habit started exactly where you are. Your brain is more changeable than you think. Today, you get to prove it.",
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { habitId } = (await request.json()) as { habitId: string }
    if (!habitId) return NextResponse.json({ error: 'habitId required' }, { status: 400 })

    const today = new Date().toISOString().split('T')[0]

    // Check if nudge already exists for today
    const { data: existing } = await supabase
      .from('nudges')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existing) {
      return NextResponse.json(existing)
    }

    // Fetch habit and recent logs
    const { data: habit } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

    const { data: logs } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7)

    const allLogs = logs || []
    const { current: streak } = calculateStreak(allLogs)
    const lastLog = allLogs[0]
    const nudgeType = determineNudgeType(streak, lastLog?.did_succeed ?? null)
    const prompt = buildNudgePrompt(habit, allLogs, streak, nudgeType)

    let content = await generateText(prompt)
    if (!content) {
      content = FALLBACK_NUDGES[nudgeType]
    }

    const { data: nudge } = await supabase
      .from('nudges')
      .upsert(
        {
          habit_id: habitId,
          user_id: user.id,
          content,
          type: nudgeType,
          date: today,
        },
        { onConflict: 'habit_id,date' },
      )
      .select()
      .single()

    return NextResponse.json(nudge)
  } catch (error) {
    console.error('Nudge API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

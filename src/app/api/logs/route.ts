import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateLogSchema } from '@/validations/log'
import { calculateStreak } from '@/lib/utils'
import { MILESTONE_DAYS } from '@/types'
import { generateText } from '@/lib/gemini'
import { buildMilestonePrompt } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = CreateLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    // Verify habit belongs to user
    const { data: habit } = await supabase
      .from('habits')
      .select('*')
      .eq('id', parsed.data.habit_id)
      .eq('user_id', user.id)
      .single()

    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

    // Upsert the log
    const { data: log, error: logError } = await supabase
      .from('habit_logs')
      .upsert(
        {
          habit_id: parsed.data.habit_id,
          user_id: user.id,
          date: parsed.data.date,
          did_succeed: parsed.data.did_succeed,
          triggers: parsed.data.triggers,
          urge_level: parsed.data.urge_level ?? null,
          mood: parsed.data.mood ?? null,
          note: parsed.data.note ?? null,
          logged_at: new Date().toISOString(),
        },
        { onConflict: 'habit_id,date' },
      )
      .select()
      .single()

    if (logError) return NextResponse.json({ error: logError.message }, { status: 500 })

    let newMilestone = null

    // Check milestones only on success
    if (parsed.data.did_succeed) {
      const { data: allLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', parsed.data.habit_id)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      const { current: currentStreak } = calculateStreak(allLogs || [])
      const relapseCount = (allLogs || []).filter(l => !l.did_succeed).length

      for (const milestoneDays of MILESTONE_DAYS) {
        if (currentStreak >= milestoneDays) {
          const { data: existing } = await supabase
            .from('milestones')
            .select('id')
            .eq('habit_id', parsed.data.habit_id)
            .eq('user_id', user.id)
            .eq('days', milestoneDays)
            .single()

          if (!existing) {
            // Generate personalized milestone message
            let message = `You reached ${milestoneDays} days without "${habit.name}"! Incredible achievement.`
            try {
              const aiMessage = await generateText(
                buildMilestonePrompt(habit, milestoneDays, relapseCount),
              )
              if (aiMessage) message = aiMessage
            } catch {
              // silently fallback to default message
            }

            const { data: milestone } = await supabase
              .from('milestones')
              .insert({
                habit_id: parsed.data.habit_id,
                user_id: user.id,
                days: milestoneDays,
                message,
                achieved_at: new Date().toISOString(),
              })
              .select()
              .single()

            newMilestone = milestone
            break // Only one milestone per log
          }
        }
      }
    }

    return NextResponse.json({ log, newMilestone }, { status: 201 })
  } catch (error) {
    console.error('POST /api/logs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

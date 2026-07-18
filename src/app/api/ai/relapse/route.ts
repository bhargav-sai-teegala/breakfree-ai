import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini'
import { buildRelapsePrompt } from '@/lib/prompts'
import { calculateStreak } from '@/lib/utils'

const FALLBACK_MESSAGE = `What happened today doesn't erase your progress. Every person in recovery has moments like this — it doesn't mean you've failed.

The most important thing right now is to be kind to yourself. Self-criticism doesn't help recovery; self-compassion does.

Your previous streak still happened. That work is still in your brain, building new neural pathways.

Take one small step right now: write down what triggered this. Understanding your triggers is how you protect yourself next time.

Tomorrow is a completely new start. You've got this.`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { habitId, triggers } = (await request.json()) as {
      habitId: string
      triggers: string[]
    }

    if (!habitId) {
      return NextResponse.json({ message: FALLBACK_MESSAGE })
    }

    const { data: habit } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (!habit) {
      return NextResponse.json({ message: FALLBACK_MESSAGE })
    }

    const { data: logs } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    const allLogs = logs || []
    const { current: streak } = calculateStreak(allLogs)
    const totalSuccess = allLogs.filter(l => l.did_succeed).length

    const prompt = buildRelapsePrompt(
      habit,
      triggers || [],
      streak,
      totalSuccess,
      allLogs.length,
    )

    let message = await generateText(prompt)
    if (!message) {
      message = FALLBACK_MESSAGE
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Relapse API error:', error)
    return NextResponse.json({ message: FALLBACK_MESSAGE })
  }
}

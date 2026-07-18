import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini'
import { buildInsightsPrompt } from '@/lib/prompts'
import { calculateStreak, getSuccessRate } from '@/lib/utils'
import type { HabitWithStats, InsightData } from '@/types'

const FALLBACK_INSIGHTS: InsightData = {
  overallScore: 50,
  headline: 'Keep logging to unlock insights',
  topInsight: 'More data needed to identify patterns',
  patterns: [
    'Log check-ins daily for accurate pattern detection',
    'Track your triggers to understand what drives urges',
    'Consistent logging reveals hidden patterns over time',
  ],
  recommendation: 'Log at least 7 days of data to unlock personalized AI insights',
  riskLevel: 'low',
  encouragement: 'Every day you log brings you closer to understanding yourself better.',
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')

    // Fetch active habits
    const query = supabase
      .from('habits')
      .select('id, name, category, motivation, target_type, target_value, unit')
      .eq('user_id', user.id)
      .is('archived_at', null)

    if (habitId) {
      query.eq('id', habitId)
    }

    const { data: habits } = await query

    if (!habits || habits.length === 0) {
      return NextResponse.json(FALLBACK_INSIGHTS)
    }

    // Fetch logs for each habit in parallel
    const habitsWithStats: HabitWithStats[] = await Promise.all(
      habits.map(async habit => {
        const { data: logs } = await supabase
          .from('habit_logs')
          .select('id, date, did_succeed, urge_level, triggers, mood')
          .eq('habit_id', habit.id)
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30)

        const allLogs = logs || []
        const { current, longest } = calculateStreak(allLogs)
        return {
          ...habit,
          currentStreak: current,
          longestStreak: longest,
          successRate: getSuccessRate(allLogs, 30),
          todayLog: null,
          recentLogs: allLogs,
        }
      }),
    )

    // Need at least some data to generate insights
    const totalLogs = habitsWithStats.reduce((sum, h) => sum + h.recentLogs.length, 0)
    if (totalLogs < 3) {
      return NextResponse.json(FALLBACK_INSIGHTS)
    }

    const prompt = buildInsightsPrompt(habitsWithStats)
    const rawText = await generateText(prompt)

    if (!rawText) {
      return NextResponse.json(FALLBACK_INSIGHTS)
    }

    try {
      // Strip potential markdown code blocks
      const cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      const parsed = JSON.parse(cleaned) as InsightData
      return NextResponse.json(parsed)
    } catch {
      console.error('Failed to parse insights JSON:', rawText)
      return NextResponse.json(FALLBACK_INSIGHTS)
    }
  } catch (error) {
    console.error('Insights API error:', error)
    return NextResponse.json(FALLBACK_INSIGHTS)
  }
}

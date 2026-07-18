import type { Habit, HabitLog, HabitWithStats } from '@/types'

/**
 * Builds a prompt for generating a daily personalized nudge.
 * 
 * @param habit - The habit the user is trying to break.
 * @param logs - Recent habit logs for context.
 * @param streak - The user's current success streak.
 * @param nudgeType - The category of nudge to generate (e.g., motivation, recovery).
 * @returns A formatted prompt string for the AI.
 */
export function buildNudgePrompt(
  habit: Habit,
  logs: HabitLog[],
  streak: number,
  nudgeType: string,
): string {
  const lastLog = logs[0]
  const successRate = logs.length
    ? Math.round((logs.filter(l => l.did_succeed).length / logs.length) * 100)
    : 0
  return `User context:
- Habit to break: "${habit.name}" (${habit.category})
- Their WHY: "${habit.motivation}"
- Goal: ${habit.target_type === 'eliminate' ? 'eliminate completely' : `reduce to ${habit.target_value} ${habit.unit}/day`}
- Current streak: ${streak} days
- Last 7 days success rate: ${successRate}%
- Yesterday: ${lastLog ? (lastLog.did_succeed ? 'resisted ✅' : 'gave in ❌') : 'no log'}
- Nudge type needed: ${nudgeType}

Write a ${nudgeType.replace(/_/g, ' ')} nudge for today. Be specific to their habit and current situation. Reference their WHY. Keep it under 80 words. No formatting, just text.`
}

/**
 * Builds a prompt for generating immediate support during an urge.
 * 
 * @param habit - The habit the user is experiencing an urge for.
 * @param triggers - Current triggers causing the urge.
 * @param urgeLevel - Intensity of the urge on a scale of 1-5.
 * @returns A formatted prompt string for the AI.
 */
export function buildUrgePrompt(habit: Habit, triggers: string[], urgeLevel: number): string {
  return `A user is experiencing an urge RIGHT NOW and needs immediate support.
- Habit they're breaking: "${habit.name}" (${habit.category})
- Their motivation: "${habit.motivation}"
- Current triggers: ${triggers.join(', ') || 'not specified'}
- Urge intensity: ${urgeLevel}/5
- Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}

Provide immediate, compassionate support. Acknowledge what they're feeling first. Give ONE specific actionable thing to do in the next 60 seconds. Under 100 words. Conversational, warm, not clinical.`
}

/**
 * Builds a prompt for generating a compassionate relapse recovery message.
 * 
 * @param habit - The habit the user relapsed on.
 * @param triggers - Triggers that led to the relapse.
 * @param previousStreak - How many days the user succeeded before the relapse.
 * @param totalSuccess - Total successful days overall.
 * @param totalDays - Total logged days overall.
 * @returns A formatted prompt string for the AI.
 */
export function buildRelapsePrompt(
  habit: Habit,
  triggers: string[],
  previousStreak: number,
  totalSuccess: number,
  totalDays: number,
): string {
  return `A user just logged that they gave in to: "${habit.name}"
- Trigger(s): ${triggers.join(', ') || 'not specified'}
- Previous streak before this: ${previousStreak} days
- Total successful days overall: ${totalSuccess} out of ${totalDays} logged days
- Their WHY: "${habit.motivation}"

Respond with genuine compassion. Do NOT minimize what happened. Acknowledge the slip honestly.
Reframe: their ${previousStreak}-day streak still happened and matters.
Give one concrete action to take RIGHT NOW to start the recovery.
End with a forward-looking, hopeful statement about tomorrow.
Under 150 words. Warm and human.`
}

/**
 * Builds a prompt to generate insights based on a user's recent habit data.
 * 
 * @param habitsWithStats - Array of habits enriched with computed statistics.
 * @returns A formatted prompt string instructing the AI to return a JSON insight object.
 */
export function buildInsightsPrompt(habitsWithStats: HabitWithStats[]): string {
  const habitData = habitsWithStats
    .map(
      h => `
  Habit: ${h.name} (${h.category})
  Current streak: ${h.currentStreak} days | Longest: ${h.longestStreak} days
  Success rate (30 days): ${h.successRate}%
  Recent logs: ${h.recentLogs.length} logged days`,
    )
    .join('\n')

  return `Analyze this user's habit data and return a JSON object.

${habitData}

Return ONLY valid JSON (no markdown, no backticks):
{
  "overallScore": <number 0-100>,
  "headline": "<one sentence summary under 60 chars>",
  "topInsight": "<most important pattern, under 100 chars>",
  "patterns": ["<pattern 1>", "<pattern 2>", "<pattern 3>"],
  "recommendation": "<one specific actionable tip, under 120 chars>",
  "riskLevel": "<low|medium|high>",
  "encouragement": "<one warm closing sentence>"
}`
}

/**
 * Builds a prompt to generate a personalized milestone celebration message.
 * 
 * @param habit - The habit the milestone was achieved for.
 * @param days - The number of streak days reached.
 * @param relapseCount - Total number of relapses prior to reaching this milestone.
 * @returns A formatted prompt string for the AI.
 */
export function buildMilestonePrompt(
  habit: Habit,
  days: number,
  relapseCount: number,
): string {
  return `A user just reached ${days} days without "${habit.name}"!
Their motivation: "${habit.motivation}"
They had ${relapseCount} relapses along the way but kept going.

Write a unique, personalized celebration message.
Acknowledge the difficulty. Reference their personal WHY.
Make it feel genuinely earned, not generic.
Under 100 words. Warm and celebratory.`
}

/**
 * Builds a prompt to suggest a healthy replacement activity for a habit.
 * 
 * @param category - The general category of the habit (e.g., smoking, scrolling).
 * @param motivation - The user's underlying motivation to quit.
 * @returns A formatted prompt string for the AI.
 */
export function buildReplacementPrompt(category: string, motivation: string): string {
  return `A user wants to break their ${category.replace(/_/g, ' ')} habit.
Their reason: "${motivation}"

Suggest ONE specific positive replacement activity they can do INSTEAD when the urge hits.
Requirements:
- Takes 5-15 minutes
- No special equipment or location needed
- Be specific (not "exercise" — say "do 10 slow squats while breathing deeply")
- Should feel genuinely appealing, not punishing
- Relevant to someone trying to break ${category.replace(/_/g, ' ')}

Return just one sentence describing the replacement activity.`
}

/**
 * Builds a prompt for generating a comprehensive weekly review.
 * 
 * @param name - The user's name.
 * @param weekData - Statistical data for the past week.
 * @returns A formatted prompt string for the AI.
 */
export function buildWeeklyReviewPrompt(
  name: string,
  weekData: {
    successRate: number
    lastWeekRate: number
    bestDay: string
    worstDay: string
    interventionCount: number
    habitCount: number
  },
): string {
  const trend = weekData.successRate >= weekData.lastWeekRate ? 'improving' : 'declining'
  return `Generate a weekly review for ${name}.

This week's stats:
- Overall success rate: ${weekData.successRate}% (${trend} from ${weekData.lastWeekRate}% last week)
- Best day: ${weekData.bestDay}
- Hardest day: ${weekData.worstDay}
- Times used the urge interceptor: ${weekData.interventionCount}
- Active habits: ${weekData.habitCount}

Write a warm, data-driven weekly review. Celebrate wins. Acknowledge struggles without shame.
Give ONE specific focus for next week.
Under 150 words.`
}

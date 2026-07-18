import { clsx, type ClassValue } from 'clsx'
import type { HabitLog } from '@/types'

/**
 * Utility function to merge tailwind classes safely.
 * 
 * @param inputs - Class names or conditional class objects to merge.
 * @returns A merged string of valid tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 * 
 * @returns Today's date string.
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Calculates the current and longest continuous streak of successful habit logs.
 *
 * @param logs - Array of habit logs containing success status and date.
 * @returns An object containing the current streak and longest streak counts.
 */
export function calculateStreak(logs: HabitLog[]): { current: number; longest: number } {
  if (!logs.length) return { current: 0, longest: 0 }

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  let current = 0
  let longest = 0
  let streak = 0

  for (let i = sorted.length - 1; i >= 0; i--) {
    const isConsec = i === sorted.length - 1 || isConsecutive(sorted[i].date, sorted[i + 1]?.date)
    if (sorted[i].did_succeed && isConsec) {
      streak++
      if (i === sorted.length - 1 || current > 0) current = streak
    } else {
      if (streak > longest) longest = streak
      streak = sorted[i].did_succeed ? 1 : 0
      if (!sorted[i].did_succeed) current = 0
    }
  }
  if (streak > longest) longest = streak

  const lastLog = sorted[sorted.length - 1]
  return { current: lastLog.did_succeed ? current || streak : 0, longest }
}

function isConsecutive(date1: string, date2: string | undefined): boolean {
  if (!date2) return true
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
  return diff === 1
}

/**
 * Calculates the success rate percentage over a given number of recent days.
 *
 * @param logs - Array of habit logs.
 * @param days - Number of recent days to calculate the rate for (default: 30).
 * @returns The success rate percentage as a number between 0 and 100.
 */
export function getSuccessRate(logs: HabitLog[], days: number = 30): number {
  if (!logs.length) return 0
  // Compute cutoff once, outside filter, to avoid repeated Date allocation
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000
  const recent = logs.filter(l => new Date(l.date).getTime() >= cutoffTime)
  if (!recent.length) return 0
  return Math.round((recent.filter(l => l.did_succeed).length / recent.length) * 100)
}

/**
 * Extracts and aggregates the most frequent triggers from the habit logs.
 *
 * @param logs - Array of habit logs containing trigger arrays.
 * @returns An array of trigger objects containing the trigger name and its frequency count, sorted descending.
 */
export function getTopTriggers(logs: HabitLog[]): { trigger: string; count: number }[] {
  const counts = logs.reduce<Record<string, number>>((acc, log) => {
    for (const t of log.triggers ?? []) {
      acc[t] = (acc[t] ?? 0) + 1
    }
    return acc
  }, {})
  return Object.entries(counts)
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Formats a raw date string into a human-readable format (e.g., 'Mon, Jan 1').
 * 
 * @param dateStr - The raw date string to format.
 * @returns The formatted, human-readable date string.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}

/**
 * Returns an emoji representation of a milestone based on the number of days achieved.
 * 
 * @param days - The number of continuous days logged.
 * @returns A corresponding emoji string representing the milestone.
 */
export function getMilestoneEmoji(days: number): string {
  if (days >= 365) return '🏆'
  if (days >= 180) return '💎'
  if (days >= 90) return '🌟'
  if (days >= 30) return '🔥'
  if (days >= 14) return '⚡'
  return '🌱'
}

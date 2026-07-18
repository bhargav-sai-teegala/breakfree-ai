import { clsx, type ClassValue } from 'clsx'
import type { HabitLog } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function calculateStreak(logs: HabitLog[]): { current: number; longest: number } {
  if (!logs.length) return { current: 0, longest: 0 }
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  let current = 0
  let longest = 0
  let streak = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].did_succeed) {
      streak++
      if (i === sorted.length - 1 || isConsecutive(sorted[i].date, sorted[i + 1]?.date)) {
        current = streak
      }
    } else {
      if (streak > longest) longest = streak
      streak = 0
    }
  }
  if (streak > longest) longest = streak
  return { current: current || (sorted[sorted.length - 1].did_succeed ? streak : 0), longest }
}

function isConsecutive(date1: string, date2: string | undefined): boolean {
  if (!date2) return true
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
  return diff === 1
}

export function getSuccessRate(logs: HabitLog[], days: number = 30): number {
  if (!logs.length) return 0
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const recent = logs.filter(l => new Date(l.date) >= cutoff)
  if (!recent.length) return 0
  return Math.round((recent.filter(l => l.did_succeed).length / recent.length) * 100)
}

export function getTopTriggers(logs: HabitLog[]): { trigger: string; count: number }[] {
  const counts: Record<string, number> = {}
  logs.forEach(log => {
    ;(log.triggers || []).forEach(t => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}

export function getMilestoneEmoji(days: number): string {
  if (days >= 365) return '🏆'
  if (days >= 180) return '💎'
  if (days >= 90) return '🌟'
  if (days >= 30) return '🔥'
  if (days >= 14) return '⚡'
  return '🌱'
}

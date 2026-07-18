import { describe, it, expect } from 'vitest'
import {
  calculateStreak,
  getSuccessRate,
  getTopTriggers,
  getTodayString,
  getMilestoneEmoji,
} from '@/lib/utils'
import type { HabitLog } from '@/types'

function makeLog(date: string, didSucceed: boolean, triggers: string[] = []): HabitLog {
  return {
    id: `log-${date}`,
    habit_id: 'habit-1',
    user_id: 'user-1',
    date,
    did_succeed: didSucceed,
    triggers,
    urge_level: null,
    mood: null,
    note: null,
    logged_at: `${date}T12:00:00Z`,
  }
}

describe('getTodayString', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const today = getTodayString()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns today\'s date', () => {
    const today = getTodayString()
    const expected = new Date().toISOString().split('T')[0]
    expect(today).toBe(expected)
  })
})

describe('calculateStreak', () => {
  it('returns zeros for empty logs', () => {
    expect(calculateStreak([])).toEqual({ current: 0, longest: 0 })
  })

  it('calculates a simple streak', () => {
    const today = new Date()
    const logs = [
      makeLog(today.toISOString().split('T')[0], true),
      makeLog(new Date(today.getTime() - 86400000).toISOString().split('T')[0], true),
      makeLog(new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0], true),
    ]
    const { current, longest } = calculateStreak(logs)
    expect(current).toBeGreaterThan(0)
    expect(longest).toBeGreaterThanOrEqual(current)
  })

  it('resets streak on failure', () => {
    const logs = [
      makeLog('2024-01-10', true),
      makeLog('2024-01-09', true),
      makeLog('2024-01-08', false),
      makeLog('2024-01-07', true),
      makeLog('2024-01-06', true),
      makeLog('2024-01-05', true),
    ]
    const { longest } = calculateStreak(logs)
    expect(longest).toBe(3)
  })

  it('handles a single successful log', () => {
    const logs = [makeLog('2024-01-01', true)]
    const { longest } = calculateStreak(logs)
    expect(longest).toBeGreaterThanOrEqual(1)
  })

  it('handles all failures', () => {
    const logs = [
      makeLog('2024-01-03', false),
      makeLog('2024-01-02', false),
      makeLog('2024-01-01', false),
    ]
    const { current, longest } = calculateStreak(logs)
    expect(current).toBe(0)
    expect(longest).toBe(0)
  })
})

describe('getSuccessRate', () => {
  it('returns 0 for empty logs', () => {
    expect(getSuccessRate([])).toBe(0)
  })

  it('returns 100 for all successes', () => {
    const today = new Date()
    const logs = [
      makeLog(today.toISOString().split('T')[0], true),
      makeLog(new Date(today.getTime() - 86400000).toISOString().split('T')[0], true),
      makeLog(new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0], true),
    ]
    expect(getSuccessRate(logs)).toBe(100)
  })

  it('returns 0 for all failures', () => {
    const today = new Date()
    const logs = [
      makeLog(today.toISOString().split('T')[0], false),
      makeLog(new Date(today.getTime() - 86400000).toISOString().split('T')[0], false),
    ]
    expect(getSuccessRate(logs)).toBe(0)
  })

  it('calculates partial rate correctly', () => {
    const today = new Date()
    const logs = [
      makeLog(today.toISOString().split('T')[0], true),
      makeLog(new Date(today.getTime() - 86400000).toISOString().split('T')[0], false),
      makeLog(new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0], true),
      makeLog(new Date(today.getTime() - 3 * 86400000).toISOString().split('T')[0], false),
    ]
    expect(getSuccessRate(logs)).toBe(50)
  })

  it('only counts logs within the specified days window', () => {
    const today = new Date()
    const logs = [
      makeLog(today.toISOString().split('T')[0], true),
      // This one is outside 7-day window
      makeLog('2020-01-01', false),
    ]
    const rate = getSuccessRate(logs, 7)
    expect(rate).toBe(100)
  })
})

describe('getTopTriggers', () => {
  it('returns empty array for logs with no triggers', () => {
    const logs = [makeLog('2024-01-01', true, [])]
    expect(getTopTriggers(logs)).toEqual([])
  })

  it('counts and sorts triggers correctly', () => {
    const logs = [
      makeLog('2024-01-03', true, ['stress', 'boredom']),
      makeLog('2024-01-02', false, ['stress', 'social']),
      makeLog('2024-01-01', true, ['stress']),
    ]
    const result = getTopTriggers(logs)
    expect(result[0].trigger).toBe('stress')
    expect(result[0].count).toBe(3)
    expect(result.length).toBe(3)
  })

  it('handles logs with empty trigger arrays', () => {
    const logs = [
      makeLog('2024-01-02', true, ['stress']),
      makeLog('2024-01-01', false, []),
    ]
    const result = getTopTriggers(logs)
    expect(result).toHaveLength(1)
    expect(result[0].trigger).toBe('stress')
  })
})

describe('getMilestoneEmoji', () => {
  it('returns seedling for days under 14', () => {
    expect(getMilestoneEmoji(1)).toBe('🌱')
    expect(getMilestoneEmoji(7)).toBe('🌱')
    expect(getMilestoneEmoji(13)).toBe('🌱')
  })

  it('returns lightning for 14+ days', () => {
    expect(getMilestoneEmoji(14)).toBe('⚡')
    expect(getMilestoneEmoji(29)).toBe('⚡')
  })

  it('returns fire for 30+ days', () => {
    expect(getMilestoneEmoji(30)).toBe('🔥')
    expect(getMilestoneEmoji(89)).toBe('🔥')
  })

  it('returns star for 90+ days', () => {
    expect(getMilestoneEmoji(90)).toBe('🌟')
    expect(getMilestoneEmoji(179)).toBe('🌟')
  })

  it('returns diamond for 180+ days', () => {
    expect(getMilestoneEmoji(180)).toBe('💎')
    expect(getMilestoneEmoji(364)).toBe('💎')
  })

  it('returns trophy for 365+ days', () => {
    expect(getMilestoneEmoji(365)).toBe('🏆')
    expect(getMilestoneEmoji(500)).toBe('🏆')
  })
})

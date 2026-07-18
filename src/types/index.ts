export type HabitCategory =
  | 'social_media'
  | 'screen_time'
  | 'gaming'
  | 'alcohol'
  | 'smoking'
  | 'junk_food'
  | 'gambling'
  | 'other'

export type TriggerType =
  | 'stress'
  | 'boredom'
  | 'social'
  | 'loneliness'
  | 'late_night'
  | 'craving'

export type NudgeType =
  | 'milestone_celebration'
  | 'momentum_builder'
  | 'recovery_encouragement'
  | 'gentle_warning'
  | 'stress_preparation'
  | 'motivational_encouragement'

export type MessageType = 'chat' | 'urge_intervention' | 'relapse_recovery'

export interface Habit {
  id: string
  user_id: string
  name: string
  category: HabitCategory
  motivation: string
  replacement_habit: string | null
  target_type: 'reduce' | 'eliminate'
  target_value: number | null
  unit: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string
  did_succeed: boolean
  triggers: string[]
  urge_level: number | null
  mood: number | null
  note: string | null
  logged_at: string
}

export interface Nudge {
  id: string
  habit_id: string
  user_id: string
  content: string
  type: NudgeType
  date: string
  created_at: string
}

export interface Milestone {
  id: string
  habit_id: string
  user_id: string
  days: number
  message: string
  achieved_at: string
}

export interface CoachMessage {
  id: string
  user_id: string
  role: 'user' | 'model'
  content: string
  habit_id: string | null
  type: MessageType
  created_at: string
}

export interface HabitWithStats extends Habit {
  currentStreak: number
  longestStreak: number
  successRate: number
  todayLog: HabitLog | null
  recentLogs: HabitLog[]
}

export interface InsightData {
  overallScore: number
  headline: string
  topInsight: string
  patterns: string[]
  recommendation: string
  riskLevel: 'low' | 'medium' | 'high'
  encouragement: string
}

export const HABIT_CATEGORIES: Record<HabitCategory, { label: string; emoji: string; color: string }> = {
  social_media: { label: 'Social Media', emoji: '📱', color: 'text-blue-400' },
  screen_time: { label: 'Screen Time', emoji: '🖥️', color: 'text-purple-400' },
  gaming: { label: 'Gaming', emoji: '🎮', color: 'text-green-400' },
  alcohol: { label: 'Alcohol', emoji: '🍺', color: 'text-amber-400' },
  smoking: { label: 'Smoking', emoji: '🚬', color: 'text-gray-400' },
  junk_food: { label: 'Junk Food', emoji: '🍔', color: 'text-orange-400' },
  gambling: { label: 'Gambling', emoji: '🎰', color: 'text-red-400' },
  other: { label: 'Other', emoji: '⚡', color: 'text-teal-400' },
}

export const TRIGGER_LABELS: Record<TriggerType, { label: string; emoji: string }> = {
  stress: { label: 'Stress', emoji: '😤' },
  boredom: { label: 'Boredom', emoji: '😴' },
  social: { label: 'Social Pressure', emoji: '👥' },
  loneliness: { label: 'Loneliness', emoji: '😔' },
  late_night: { label: 'Late Night', emoji: '🌙' },
  craving: { label: 'Just a Craving', emoji: '🎯' },
}

export const MILESTONE_DAYS = [7, 14, 30, 90, 180, 365]

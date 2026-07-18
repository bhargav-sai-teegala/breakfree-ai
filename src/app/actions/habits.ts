'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateHabitSchema, UpdateHabitSchema } from '@/validations/habit'
import { CreateLogSchema } from '@/validations/log'
import { MILESTONE_DAYS } from '@/types'
import { calculateStreak } from '@/lib/utils'
import { redirect } from 'next/navigation'

/**
 * Server action to create a new habit for the current user.
 * 
 * @param _prevState - Previous form state.
 * @param formData - Form data containing habit details (name, category, motivation, etc).
 * @returns An object with success status and any validation errors.
 */
export async function createHabitAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = {
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    motivation: formData.get('motivation') as string,
    target_type: formData.get('target_type') as string,
    target_value: formData.get('target_value') ? Number(formData.get('target_value')) : null,
    unit: formData.get('unit') as string || null,
  }

  const parsed = CreateHabitSchema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      errors: {
        name: errors.name?.[0],
        category: errors.category?.[0],
        motivation: errors.motivation?.[0],
        target_type: errors.target_type?.[0],
      },
    }
  }

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: parsed.data.name,
    category: parsed.data.category,
    motivation: parsed.data.motivation,
    target_type: parsed.data.target_type,
    target_value: parsed.data.target_value ?? null,
    unit: parsed.data.unit ?? null,
    replacement_habit: null,
  })

  if (error) {
    return { success: false, errors: { general: error.message } }
  }

  redirect('/habits')
}

/**
 * Server action to update an existing habit's details.
 * 
 * @param habitId - The ID of the habit to update.
 * @param _prevState - Previous form state.
 * @param formData - Form data containing updated habit details.
 * @returns An object with success status and any validation errors.
 */
export async function updateHabitAction(habitId: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = {
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    motivation: formData.get('motivation') as string,
    target_type: formData.get('target_type') as string,
    target_value: formData.get('target_value') ? Number(formData.get('target_value')) : null,
    unit: formData.get('unit') as string || null,
  }

  const parsed = UpdateHabitSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('habits')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', habitId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, errors: { general: error.message } }
  }

  return { success: true }
}

/**
 * Server action to archive a habit. Soft-deletes the habit so historical data is preserved.
 * 
 * @param habitId - The ID of the habit to archive.
 */
export async function archiveHabitAction(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('habits')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', habitId)
    .eq('user_id', user.id)

  redirect('/habits')
}

/**
 * Server action to create or update a habit log (check-in) for a specific date.
 * Automatically evaluates and grants milestones if a streak is reached.
 * 
 * @param _prevState - Previous form state.
 * @param formData - Form data containing log details (habit_id, date, did_succeed, triggers, etc).
 * @returns An object with success status, any errors, and the resulting log data.
 */
export async function createLogAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const triggersRaw = formData.get('triggers') as string
  const raw = {
    habit_id: formData.get('habit_id') as string,
    date: formData.get('date') as string,
    did_succeed: formData.get('did_succeed') === 'true',
    triggers: triggersRaw ? JSON.parse(triggersRaw) : [],
    urge_level: formData.get('urge_level') ? Number(formData.get('urge_level')) : null,
    mood: formData.get('mood') ? Number(formData.get('mood')) : null,
    note: formData.get('note') as string || null,
  }

  const parsed = CreateLogSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { data: log, error } = await supabase
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

  if (error) {
    return { success: false, errors: { general: error.message } }
  }

  // Check for milestone achievements
  const { data: allLogs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', parsed.data.habit_id)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (allLogs && parsed.data.did_succeed) {
    const { current: currentStreak } = calculateStreak(allLogs)

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
          await supabase.from('milestones').insert({
            habit_id: parsed.data.habit_id,
            user_id: user.id,
            days: milestoneDays,
            message: `You reached a ${milestoneDays}-day streak! Amazing work.`,
            achieved_at: new Date().toISOString(),
          })
        }
      }
    }
  }

  return { success: true, log }
}

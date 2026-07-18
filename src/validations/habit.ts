import { z } from 'zod'

const HABIT_CATEGORIES = [
  'social_media',
  'screen_time',
  'gaming',
  'alcohol',
  'smoking',
  'junk_food',
  'gambling',
  'other',
] as const

export const CreateHabitSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Habit name must be at least 2 characters' })
    .max(100),
  category: z.enum(HABIT_CATEGORIES, { error: 'Please select a category' }),
  motivation: z
    .string()
    .min(10, { error: 'Please write at least 10 characters about your why' })
    .max(500),
  target_type: z.enum(['reduce', 'eliminate']),
  target_value: z.number().int().positive().optional().nullable(),
  unit: z.string().optional().nullable(),
})

export const UpdateHabitSchema = CreateHabitSchema.partial()

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>
export type UpdateHabitInput = z.infer<typeof UpdateHabitSchema>

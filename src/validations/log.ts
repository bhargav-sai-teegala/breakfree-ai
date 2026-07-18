import { z } from 'zod'

export const CreateLogSchema = z.object({
  habit_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Invalid date format' }),
  did_succeed: z.boolean(),
  triggers: z.array(z.string()).default([]),
  urge_level: z.number().int().min(1).max(5).optional().nullable(),
  mood: z.number().int().min(1).max(5).optional().nullable(),
  note: z.string().max(500).optional().nullable(),
})

export type CreateLogInput = z.infer<typeof CreateLogSchema>

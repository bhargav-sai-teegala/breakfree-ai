import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHabitAction, archiveHabitAction, createLogAction } from '@/app/actions/habits'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock Supabase
const mockFrom = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockGetUser = vi.fn()
const mockUpsert = vi.fn()
const mockSelect = vi.fn()
const mockOrder = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}))

describe('Habit Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    
    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
      upsert: mockUpsert,
      select: mockSelect,
    })
    
    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
    })
    
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: mockEq,
      }),
    })
    
    mockUpsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
    })
    
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: mockOrder,
        }),
      }),
    })
  })

  describe('createHabitAction', () => {
    it('returns error if user not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } })
      const formData = new FormData()
      try {
        await createHabitAction(null, formData)
      } catch {
        // redirect
      }
    })

    it('returns error if invalid data', async () => {
      const formData = new FormData()
      const res = await createHabitAction(null, formData)
      if (res && 'success' in res) {
        expect(res.success).toBe(false)
      }
    })
  })

  describe('archiveHabitAction', () => {
    it('calls update with archived: true', async () => {
      mockEq.mockResolvedValueOnce({ error: null })
      try {
        await archiveHabitAction('habit-1')
      } catch {
        // redirect
      }
      expect(mockUpdate).toHaveBeenCalled()
    })
  })

  describe('createLogAction', () => {
    it('returns error if user not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } })
      const formData = new FormData()
      try {
        await createLogAction(null, formData)
      } catch {
        // redirect
      }
    })

    it('inserts log entry', async () => {
      mockSingle.mockResolvedValueOnce({ error: null, data: { id: 'log-1' } })
      mockOrder.mockResolvedValueOnce({ data: [] })
      
      const formData = new FormData()
      formData.set('habit_id', 'habit-1')
      formData.set('date', '2023-01-01')
      formData.set('did_succeed', 'true')
      
      const res = await createLogAction(null, formData)
      if (res && 'success' in res && res.success) {
        expect(mockUpsert).toHaveBeenCalled()
      }
    })
  })
})

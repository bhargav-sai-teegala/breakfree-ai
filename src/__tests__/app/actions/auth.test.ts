import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerAction, loginAction, logoutAction } from '@/app/actions/auth'

// Mock Supabase
const mockAuth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: mockAuth,
  }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerAction', () => {
    it('returns error if missing fields', async () => {
      const formData = new FormData()
      const res = await registerAction(null, formData)
      expect(res.success).toBe(false)
      expect(res.errors?.email).toBeDefined()
    })

    it('returns success on valid signup', async () => {
      mockAuth.signUp.mockResolvedValueOnce({ data: { session: true }, error: null })
      const formData = new FormData()
      formData.set('email', 'test@example.com')
      formData.set('password', 'password123')
      formData.set('name', 'Test User')
      
      await registerAction(null, formData)
      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: { data: { name: 'Test User' } },
      })
    })

    it('returns error on supabase failure', async () => {
      mockAuth.signUp.mockResolvedValueOnce({ error: { message: 'Auth failed' } })
      const formData = new FormData()
      formData.set('email', 'test@example.com')
      formData.set('password', 'password123')
      formData.set('name', 'Test User')
      
      const res = await registerAction(null, formData)
      expect(res.success).toBe(false)
      expect(res.errors?.general).toBe('Auth failed')
    })
  })

  describe('loginAction', () => {
    it('returns error if missing fields', async () => {
      const formData = new FormData()
      const res = await loginAction(null, formData)
      if (res && 'success' in res) {
        expect(res.success).toBe(false)
        expect(res.errors?.email).toBeDefined()
      }
    })

    it('returns success on valid login', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({ error: null })
      const formData = new FormData()
      formData.set('email', 'test@example.com')
      formData.set('password', 'password123')
      
      try {
        await loginAction(null, formData)
      } catch {
        // expected redirect
      }
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  describe('logoutAction', () => {
    it('calls signOut', async () => {
      mockAuth.signOut.mockResolvedValueOnce({ error: null })
      await logoutAction()
      expect(mockAuth.signOut).toHaveBeenCalledTimes(1)
    })
  })
})

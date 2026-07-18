import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateText, generateStream } from '@/lib/gemini'

// Mock the server-only import to prevent issues in the test runner
vi.mock('server-only', () => ({}))

// Mock the GoogleGenerativeAI module
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async (prompt: string) => {
            if (prompt === 'throw_error') {
              throw new Error('API Error')
            }
            return {
              response: {
                text: () => 'Mocked AI response for: ' + prompt,
              },
            }
          },
          generateContentStream: async () => {
            return {
              stream: ['Chunk 1', 'Chunk 2'],
            }
          },
        }
      }
    }
  }
})

describe('gemini.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {}) // silence error logs
  })

  describe('generateText', () => {
    it('returns the text from the model response', async () => {
      const response = await generateText('Hello')
      expect(response).toBe('Mocked AI response for: Hello')
    })

    it('returns an empty string and logs the error on failure', async () => {
      const response = await generateText('throw_error')
      expect(response).toBe('')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('generateStream', () => {
    it('calls generateContentStream on the model', async () => {
      const stream = await generateStream([{ role: 'user', parts: [{ text: 'Hello stream' }] }])
      // Using a type assertion since the mock returns a specific structure
      expect((stream as { stream: string[] }).stream).toEqual(['Chunk 1', 'Chunk 2'])
    })
  })
})

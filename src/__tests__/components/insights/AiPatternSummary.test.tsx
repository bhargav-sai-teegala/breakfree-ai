import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AiPatternSummary } from '@/components/insights/AiPatternSummary'
import { ReactNode } from 'react'

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
}))

describe('AiPatternSummary', () => {
  const mockInsights = {
    riskLevel: 'low',
    overallScore: 85,
    headline: 'Doing great!',
    topInsight: 'You successfully avoided triggers this week.',
    patterns: ['Pattern 1', 'Pattern 2'],
    recommendation: 'Keep using breathing exercises.',
    encouragement: 'You got this!',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders loading skeletons initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => new Promise(() => {}))
    const { container } = render(<AiPatternSummary habitId="123" />)
    expect(container.querySelectorAll('.skeleton')).toHaveLength(4)
  })

  it('renders insights correctly after fetch', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => mockInsights,
    })

    render(<AiPatternSummary habitId="123" />)

    await waitFor(() => {
      expect(screen.getByText('Doing great!')).toBeInTheDocument()
    })

    expect(screen.getByText('You successfully avoided triggers this week.')).toBeInTheDocument()
    expect(screen.getByText('Pattern 1')).toBeInTheDocument()
    expect(screen.getByText('Keep using breathing exercises.')).toBeInTheDocument()
  })

  it('renders nothing on error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed'))
    
    const { container } = render(<AiPatternSummary habitId="123" />)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })
})

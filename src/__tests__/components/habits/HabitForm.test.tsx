import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HabitForm } from '@/components/habits/HabitForm'
import { createHabitAction } from '@/app/actions/habits'
import { ReactNode } from 'react'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

// Mock server action
vi.mock('@/app/actions/habits', () => ({
  createHabitAction: vi.fn(),
}))

describe('HabitForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders step 0 initially', () => {
    render(<HabitForm />)
    expect(screen.getByText('What are you working on?')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('validates step 0 and prevents moving to next step if invalid', async () => {
    render(<HabitForm />)
    const nextBtn = screen.getByText('Next')
    fireEvent.click(nextBtn)
    
    // Category is required
    await waitFor(() => {
      expect(screen.getByText('Please select a category')).toBeInTheDocument()
    })
  })

  it('can navigate through steps and submit', async () => {
    (createHabitAction as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ success: true })
    
    render(<HabitForm />)
    
    // Fill step 0
    fireEvent.click(screen.getByText('Smoking'))
    fireEvent.change(screen.getByPlaceholderText(/e.g., "Scroll Instagram before bed"/), {
      target: { value: 'Stop smoking' }
    })
    
    fireEvent.click(screen.getByText('Next'))
    
    // Step 1
    await waitFor(() => {
      expect(screen.getByText('What\'s your goal?')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('🚫 Eliminate completely'))
    fireEvent.click(screen.getByText('Next'))
    
    // Step 2
    await waitFor(() => {
      expect(screen.getByText('Why do you want to break this habit?')).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByPlaceholderText('I want to break this because...'), {
      target: { value: 'For my health' }
    })
    
    fireEvent.click(screen.getByText('Start breaking free ⚡'))
    
    await waitFor(() => {
      expect(createHabitAction).toHaveBeenCalledTimes(1)
    })
  })
})

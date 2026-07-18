import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HabitCard } from '@/components/habits/HabitCard'
import { Habit } from '@/types'
import { ReactNode } from 'react'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

describe('HabitCard component', () => {
  const mockHabit: Habit = {
    id: '123',
    user_id: 'user1',
    name: 'Stop Smoking',
    category: 'smoking',
    target_type: 'eliminate',
    target_value: 0,
    unit: 'cigarettes',
    motivation: 'For my health',
    created_at: '2023-01-01T00:00:00Z',
  }

  it('renders habit details correctly', () => {
    render(<HabitCard habit={mockHabit} currentStreak={5} longestStreak={10} />)
    expect(screen.getByText('Stop Smoking')).toBeInTheDocument()
    expect(screen.getByText('Goal: Eliminate completely')).toBeInTheDocument()
    expect(screen.getByText('“For my health”')).toBeInTheDocument()
    expect(screen.getByText('5d streak')).toBeInTheDocument()
    expect(screen.getByText('10d')).toBeInTheDocument()
  })

  it('renders reduce target correctly', () => {
    const reduceHabit = { ...mockHabit, target_type: 'reduce' as const, target_value: 2 }
    render(<HabitCard habit={reduceHabit} currentStreak={2} longestStreak={2} />)
    expect(screen.getByText('Goal: Reduce to 2 cigarettes/day')).toBeInTheDocument()
  })
})

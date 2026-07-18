import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UrgeButton } from '@/components/dashboard/UrgeButton'
import { ReactNode } from 'react'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
}))

// Mock next/navigation
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('UrgeButton component', () => {
  it('renders correctly', () => {
    render(<UrgeButton />)
    expect(screen.getByText('FEELING AN URGE?')).toBeInTheDocument()
    expect(screen.getByText('Tap for immediate help →')).toBeInTheDocument()
  })

  it('navigates to /urge on click', () => {
    render(<UrgeButton />)
    const button = screen.getByRole('button', { name: 'Get immediate help with an urge' })
    fireEvent.click(button)
    expect(pushMock).toHaveBeenCalledWith('/urge')
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LoadingSkeleton, CardSkeleton, ListSkeleton } from '@/components/shared/LoadingSkeleton'

describe('LoadingSkeleton components', () => {
  describe('LoadingSkeleton', () => {
    it('renders a single skeleton by default', () => {
      const { container } = render(<LoadingSkeleton />)
      expect(container.querySelectorAll('.skeleton')).toHaveLength(1)
    })

    it('renders multiple skeletons when count is provided', () => {
      const { container } = render(<LoadingSkeleton count={3} />)
      expect(container.querySelectorAll('.skeleton')).toHaveLength(3)
    })

    it('applies custom className', () => {
      const { container } = render(<LoadingSkeleton className="h-10 w-10" />)
      expect(container.querySelector('.h-10.w-10')).toBeInTheDocument()
    })
  })

  describe('CardSkeleton', () => {
    it('renders a card structure', () => {
      const { container } = render(<CardSkeleton />)
      expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    })
  })

  describe('ListSkeleton', () => {
    it('renders 3 CardSkeletons by default', () => {
      const { container } = render(<ListSkeleton />)
      expect(container.querySelectorAll('.glass-card')).toHaveLength(3)
    })

    it('renders specified number of CardSkeletons', () => {
      const { container } = render(<ListSkeleton count={5} />)
      expect(container.querySelectorAll('.glass-card')).toHaveLength(5)
    })
  })
})

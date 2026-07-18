import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/shared/EmptyState'

describe('EmptyState component', () => {
  it('renders title and description correctly', () => {
    render(
      <EmptyState title="No Rockets" description="Time to build one." />
    )
    expect(screen.getByText('No Rockets')).toBeInTheDocument()
    expect(screen.getByText('Time to build one.')).toBeInTheDocument()
  })

  it('renders action node when provided', () => {
    const { getByText } = render(
      <EmptyState 
        title="No Rockets" 
        description="Time to build one." 
        action={<button>Launch</button>} 
      />
    )
    expect(getByText('Launch')).toBeInTheDocument()
  })

  it('does not render action container when no action is provided', () => {
    const { queryByRole } = render(
      <EmptyState title="No Rockets" description="Time to build one." />
    )
    expect(queryByRole('button')).not.toBeInTheDocument()
  })
})

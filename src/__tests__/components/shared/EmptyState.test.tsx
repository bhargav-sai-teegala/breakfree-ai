import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { EmptyState } from '@/components/shared/EmptyState'

describe('EmptyState component', () => {
  it('renders emoji, title, and description correctly', () => {
    const { getByText } = render(
      <EmptyState emoji="🚀" title="No Rockets" description="Time to build one." />
    )
    expect(getByText('🚀')).toBeInTheDocument()
    expect(getByText('No Rockets')).toBeInTheDocument()
    expect(getByText('Time to build one.')).toBeInTheDocument()
  })

  it('renders action node when provided', () => {
    const { getByRole } = render(
      <EmptyState 
        emoji="🚀" 
        title="No Rockets" 
        description="Time to build one." 
        action={<button>Launch</button>} 
      />
    )
    expect(getByRole('button', { name: 'Launch' })).toBeInTheDocument()
  })

  it('does not render action container when no action is provided', () => {
    const { queryByRole } = render(
      <EmptyState emoji="🚀" title="No Rockets" description="Time to build one." />
    )
    expect(queryByRole('button')).not.toBeInTheDocument()
  })
})

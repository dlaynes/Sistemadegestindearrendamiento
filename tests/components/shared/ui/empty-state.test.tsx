import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Inbox } from 'lucide-react'
import { EmptyState } from '@/app/components/shared/ui/empty-state'

describe('EmptyState', () => {
  it('renders icon, title, and description', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No items"
        description="Start by adding your first item"
      />
    )

    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('Start by adding your first item')).toBeInTheDocument()
  })

  it('action button fires onClick', () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        icon={Inbox}
        title="No items"
        action={{ label: 'Add Item', onClick }}
      />
    )

    fireEvent.click(screen.getByText('Add Item'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it.each(['sm', 'md', 'lg'] as const)('renders with iconSize %s', (size) => {
    const { container } = render(
      <EmptyState icon={Inbox} title="Test" iconSize={size} />
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

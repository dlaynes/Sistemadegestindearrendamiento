import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendingDown } from 'lucide-react'
import { StatsCard } from '@/app/components/shared/dashboard/stats-card'

describe('StatsCard', () => {
  it('renders label and value', () => {
    render(<StatsCard label="Revenue" value="$1,200" icon={TrendingDown} color="bg-primary" />)

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,200')).toBeInTheDocument()
  })

  it('renders change when provided', () => {
    render(
      <StatsCard
        label="Users"
        value={42}
        icon={TrendingDown}
        color="bg-primary"
        change="+5%"
      />
    )

    expect(screen.getByText('+5%')).toBeInTheDocument()
  })

  it('hides trend icon when showTrend is false', () => {
    const { container } = render(
      <StatsCard
        label="Users"
        value={42}
        icon={TrendingDown}
        color="bg-primary"
        showTrend={false}
      />
    )

    expect(container.querySelector('.text-success')).not.toBeInTheDocument()
  })
})

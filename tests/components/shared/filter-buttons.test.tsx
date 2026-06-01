import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterButtons } from '@/app/components/shared/lists/filter-buttons'

describe('FilterButtons', () => {
  const options = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ]

  it('renders all options', () => {
    render(<FilterButtons options={options} activeValue="all" onChange={vi.fn()} />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Activos')).toBeInTheDocument()
    expect(screen.getByText('Inactivos')).toBeInTheDocument()
  })

  it('active option has primary styling', () => {
    const { container } = render(<FilterButtons options={options} activeValue="active" onChange={vi.fn()} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons[1].className).toContain('bg-primary')
  })

  it('clicking option calls onChange', () => {
    const onChange = vi.fn()
    render(<FilterButtons options={options} activeValue="all" onChange={onChange} />)
    fireEvent.click(screen.getByText('Activos'))
    expect(onChange).toHaveBeenCalledWith('active')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/app/components/shared/ui/status-badge'

describe('StatusBadge', () => {
  it('renders contract status with correct label', () => {
    render(<StatusBadge status="activo" type="contract" />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('renders payment status with correct label', () => {
    render(<StatusBadge status="pendiente" type="payment" />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('renders property status with correct label', () => {
    render(<StatusBadge status="disponible" type="property" />)
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('renders user status with correct label', () => {
    render(<StatusBadge status="activo" type="user" />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('uses custom label when provided', () => {
    render(<StatusBadge status="activo" type="contract" label="Custom" />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)('applies correct size classes for %s', (size) => {
    const { container } = render(<StatusBadge status="activo" type="contract" size={size} />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })
})

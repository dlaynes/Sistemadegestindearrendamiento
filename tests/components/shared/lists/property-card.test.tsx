import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { PropertyListItem, PropertyStatus } from '@/app/types'
import { PropertyCard } from '@/app/components/shared/lists/property-card'

describe('PropertyCard Integration', () => {
  const mockProperty: PropertyListItem = {
    id: 1,
    name: 'Cozy Apartment',
    address: '123 Main St',
    status: 'disponible' as PropertyStatus,
    rent: '1500',
    bedrooms: 2,
    bathrooms: 1,
    area: '80',
  }

  it('renders property details correctly', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByText('Cozy Apartment')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
    expect(screen.getByText(/2 Habs/)).toBeInTheDocument()
    expect(screen.getByText(/1 Baños/)).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
    expect(screen.getByText('1500')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('calls onView when view button is clicked', () => {
    const onView = vi.fn()
    render(<PropertyCard property={mockProperty} onView={onView} />)

    const viewButton = screen.getByRole('button', { name: /Ver Detalles/i })
    fireEvent.click(viewButton)

    expect(onView).toHaveBeenCalledTimes(1)
    expect(onView).toHaveBeenCalledWith(mockProperty)
  })
})

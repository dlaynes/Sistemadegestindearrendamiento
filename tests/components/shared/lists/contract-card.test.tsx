import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ContractListItem } from '@/app/types'
import { ContractCard } from '@/app/components/shared/lists/contract-card'

describe('ContractCard', () => {
  const mockContract: ContractListItem = {
    id: 1,
    code: 'CNT-001',
    tenantName: 'Tenant One',
    property: 'Cozy Apartment',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    monthlyRent: '1500',
    deposit: '3000',
    status: 'activo',
  }

  it('renders contract info', () => {
    render(<ContractCard contract={mockContract} />)

    expect(screen.getByText('CNT-001')).toBeInTheDocument()
    // property appears twice, check specific context
    expect(screen.getAllByText('Cozy Apartment').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Tenant One')).toBeInTheDocument()
    expect(screen.getByText('1500')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('shows expiration warning when expiring soon', () => {
    const expiringSoon: ContractListItem = {
      ...mockContract,
      endDate: '2026-08-15',
    }
    render(<ContractCard contract={expiringSoon} />)

    expect(screen.getByText(/Próximo a vencer/)).toBeInTheDocument()
  })

  it('action buttons fire callbacks', () => {
    const onView = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <ContractCard
        contract={mockContract}
        showActions
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )

    fireEvent.click(screen.getByText('Ver Detalles'))
    expect(onView).toHaveBeenCalledWith(mockContract)

    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockContract)

    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith(mockContract)
  })
})

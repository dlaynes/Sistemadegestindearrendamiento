import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AmendmentCard } from '@/app/components/shared/amendments/amendment-card'
import type { ContractAmendment } from '@/app/types/contract-amendment'

function makeAmendment(overrides: Partial<ContractAmendment> = {}): ContractAmendment {
  return {
    id: 1,
    contractId: 1,
    proposedByUserId: 1,
    proposedByRole: 'arrendador',
    status: 'pending_tenant',
    proposedChanges: { monthlyRent: '1700' },
    reason: 'Ajuste anual',
    createdAt: '2026-06-01T10:00:00',
    expiresAt: '2026-06-15T10:00:00',
    ...overrides,
  }
}

describe('AmendmentCard', () => {
  it('renders a value-amendment diff for monthlyRent', () => {
    render(
      <MemoryRouter>
        <AmendmentCard amendment={makeAmendment()} onApprove={vi.fn()} onReject={vi.fn()} />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Modificar valores/i)).toBeInTheDocument()
    expect(screen.getAllByText(/\$1700/).length).toBeGreaterThan(0)
  })

  it('renders a closure diff with destructive styling', () => {
    render(
      <MemoryRouter>
        <AmendmentCard
          amendment={makeAmendment({ proposedChanges: { status: 'cancelado' } })}
          onApprove={vi.fn()}
          onReject={vi.fn()}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Cerrar contrato/i)).toBeInTheDocument()
    expect(screen.getByText(/activo → cancelado/i)).toBeInTheDocument()
  })

  it('shows decide buttons when canDecide and the amendment is pending', () => {
    render(
      <MemoryRouter>
        <AmendmentCard
          amendment={makeAmendment()}
          canDecide
          onApprove={vi.fn()}
          onReject={vi.fn()}
        />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /Aprobar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument()
  })
})

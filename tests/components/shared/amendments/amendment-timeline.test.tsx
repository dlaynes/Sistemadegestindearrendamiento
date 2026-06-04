import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderWithProviders } from '../../../utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '../../../mocks/server'
import { http, HttpResponse } from 'msw'
import { AmendmentTimeline } from '@/app/components/shared/amendments/amendment-timeline'
import type { ContractAmendment } from '@/app/types/contract-amendment'

const API_BASE = 'http://localhost:8080/api'

function setUser(user: { id: number; role: string; name: string }) {
  localStorage.setItem('rentmanager_user', JSON.stringify(user))
}

function makeAmendment(overrides: Partial<ContractAmendment> = {}): ContractAmendment {
  return {
    id: 1,
    contractId: 1,
    proposedByUserId: 99,
    proposedByRole: 'arrendador',
    status: 'pending_tenant',
    proposedChanges: { monthlyRent: '1700' },
    reason: 'Ajuste anual',
    createdAt: '2026-06-01T10:00:00',
    expiresAt: '2026-06-15T10:00:00',
    ...overrides,
  }
}

describe('AmendmentTimeline', () => {
  beforeEach(() => setUser({ id: 1, role: 'arrendador', name: 'L' }))
  afterEach(() => localStorage.clear())

  it('shows the empty state when the contract has no amendments', async () => {
    server.use(
      http.get(`${API_BASE}/landlord/contracts/:id/amendments`, () => HttpResponse.json([])),
    )
    renderWithProviders(<AmendmentTimeline contractId={1} />)
    await waitFor(() =>
      expect(screen.getByText(/Sin enmiendas todavía/i)).toBeInTheDocument(),
    )
  })

  it('renders one card per amendment returned by the API', async () => {
    server.use(
      http.get(`${API_BASE}/landlord/contracts/:id/amendments`, () =>
        HttpResponse.json([
          makeAmendment({ id: 1, proposedChanges: { monthlyRent: '1700' } }),
          makeAmendment({ id: 2, proposedChanges: { status: 'cancelado' } }),
        ]),
      ),
    )
    renderWithProviders(<AmendmentTimeline contractId={1} />)
    await waitFor(() => {
      expect(screen.getAllByText(/Modificar valores|Cerrar contrato/i).length).toBeGreaterThanOrEqual(2)
    })
  })

  it('renders a mix of value-amendment and closure cards', async () => {
    server.use(
      http.get(`${API_BASE}/landlord/contracts/:id/amendments`, () =>
        HttpResponse.json([
          makeAmendment({ id: 10, proposedChanges: { monthlyRent: '1800' } }),
          makeAmendment({ id: 11, proposedChanges: { status: 'cancelado' } }),
        ]),
      ),
    )
    renderWithProviders(<AmendmentTimeline contractId={1} />)
    await waitFor(() => {
      expect(screen.getByText(/Modificar valores/i)).toBeInTheDocument()
      expect(screen.getByText(/Cerrar contrato/i)).toBeInTheDocument()
    })
  })

  it('invokes onApprove when the user clicks Aprobar on a decide-enabled card', async () => {
    const user = userEvent.setup()
    const onApprove = vi.fn()
    server.use(
      http.get(`${API_BASE}/landlord/contracts/:id/amendments`, () =>
        HttpResponse.json([
          makeAmendment({ id: 1, proposedByUserId: 99, status: 'pending_tenant' }),
        ]),
      ),
    )
    renderWithProviders(
      <AmendmentTimeline
        contractId={1}
        currentUserId={1}
        currentUserRole="arrendador"
        onApprove={onApprove}
        onReject={vi.fn()}
      />,
    )
    // Use the more specific button name pattern: button with Aprobar as text, not the StatusBadge aria-label
    const approveBtn = await screen.findByRole('button', { name: /^Aprobar$/ })
    await user.click(approveBtn)
    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(onApprove.mock.calls[0][0].id).toBe(1)
  })

  it('does not show decide buttons for the proposer', async () => {
    server.use(
      http.get(`${API_BASE}/landlord/contracts/:id/amendments`, () =>
        HttpResponse.json([
          makeAmendment({ id: 1, proposedByUserId: 1, status: 'pending_tenant' }),
        ]),
      ),
    )
    renderWithProviders(
      <AmendmentTimeline
        contractId={1}
        currentUserId={1}
        currentUserRole="arrendador"
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    await screen.findByText(/Modificar valores/i)
    expect(screen.queryByRole('button', { name: /^Aprobar$/ })).not.toBeInTheDocument()
  })

  it('does not show decide buttons for already-decided amendments', async () => {
    server.use(
      http.get(`${API_BASE}/landlord/contracts/:id/amendments`, () =>
        HttpResponse.json([
          makeAmendment({ id: 1, proposedByUserId: 99, status: 'approved' }),
        ]),
      ),
    )
    renderWithProviders(
      <AmendmentTimeline
        contractId={1}
        currentUserId={1}
        currentUserRole="arrendador"
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    await screen.findByText(/Modificar valores/i)
    expect(screen.queryByRole('button', { name: /^Aprobar$/ })).not.toBeInTheDocument()
  })
})

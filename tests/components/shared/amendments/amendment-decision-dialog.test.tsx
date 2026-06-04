import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderWithProviders } from '../../../utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AmendmentDecisionDialog } from '@/app/components/shared/amendments/amendment-decision-dialog'
import type { ContractAmendment } from '@/app/types/contract-amendment'

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

describe('AmendmentDecisionDialog', () => {
  beforeEach(() => {
    setUser({ id: 1, role: 'arrendador', name: 'L' })
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('renders the value-amendment title when decision=APPROVED', () => {
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="APPROVED"
        open
        onOpenChange={() => {}}
      />,
    )
    expect(screen.getByText(/Aprobar cambio/i)).toBeInTheDocument()
  })

  it('renders the closure-specific title when the amendment is a closure', () => {
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment({ proposedChanges: { status: 'cancelado' } })}
        decision="APPROVED"
        open
        onOpenChange={() => {}}
      />,
    )
    expect(screen.getByText(/Aprobar cierre del contrato/i)).toBeInTheDocument()
  })

  it('renders the rejection title for decision=REJECTED', () => {
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="REJECTED"
        open
        onOpenChange={() => {}}
      />,
    )
    expect(screen.getByText(/Rechazar cambio/i)).toBeInTheDocument()
  })

  it('disables the submit button when the rejection note is too short', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="REJECTED"
        open
        onOpenChange={() => {}}
      />,
    )
    const submit = screen.getByRole('button', { name: /Rechazar/i })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText(/Nota/i), 'no')
    expect(submit).toBeDisabled()
    expect(screen.getByText(/Mínimo 3 caracteres/i)).toBeInTheDocument()
  })

  it('enables the submit button once the rejection note is long enough', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="REJECTED"
        open
        onOpenChange={() => {}}
      />,
    )
    await user.type(screen.getByLabelText(/Nota/i), 'ok motivo')
    const submit = screen.getByRole('button', { name: /Rechazar/i })
    expect(submit).not.toBeDisabled()
  })

  it('does not require a note for decision=APPROVED', () => {
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="APPROVED"
        open
        onOpenChange={() => {}}
      />,
    )
    const submit = screen.getByRole('button', { name: /Aprobar/i })
    expect(submit).not.toBeDisabled()
  })

  it('trims whitespace and closes the dialog on a successful APPROVED', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="APPROVED"
        open
        onOpenChange={onOpenChange}
      />,
    )
    await user.type(screen.getByLabelText(/Nota/i), '  aceptado  ')
    await user.click(screen.getByRole('button', { name: /Aprobar/i }))

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('calls onSuccess when a decision succeeds', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    const onOpenChange = vi.fn()
    renderWithProviders(
      <AmendmentDecisionDialog
        contractId={1}
        amendment={makeAmendment()}
        decision="APPROVED"
        open
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Aprobar/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})

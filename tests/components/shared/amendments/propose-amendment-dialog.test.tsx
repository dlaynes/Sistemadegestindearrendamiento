import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../utils/test-utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProposeAmendmentDialog } from '@/app/components/shared/amendments/propose-amendment-dialog'

function setUser(user: { id: number; role: string; name: string }) {
  localStorage.setItem('rentmanager_user', JSON.stringify(user))
}

describe('ProposeAmendmentDialog', () => {
  beforeEach(() => setUser({ id: 1, role: 'arrendador', name: 'L' }))

  it('opens with the value-amendment form by default', async () => {
    renderWithProviders(<ProposeAmendmentDialog contractId={1} open onOpenChange={() => {}} />)
    expect(screen.getByLabelText(/Renta mensual/i)).toBeInTheDocument()
  })

  it('switches to the closure form and requires a reason + confirm', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProposeAmendmentDialog contractId={1} open onOpenChange={() => {}} />)
    await user.click(screen.getByRole('button', { name: /Cerrar contrato/i }))
    expect(screen.getByText(/Cerrar el contrato implica/i)).toBeInTheDocument()
    const submit = screen.getByRole('button', { name: /Proponer/i })
    expect(submit).toBeDisabled()
  })

  it('blocks submit when a pending amendment already exists', async () => {
    // The mock returns 2 pending amendments, so the dialog must disable the submit
    // until the existing proposal is decided.
    const user = userEvent.setup()
    renderWithProviders(<ProposeAmendmentDialog contractId={1} open onOpenChange={() => {}} />)
    await user.click(screen.getByRole('button', { name: /Cerrar contrato/i }))
    expect(screen.getByText(/Ya existe una enmienda pendiente/i)).toBeInTheDocument()
    const submit = screen.getByRole('button', { name: /Proponer/i })
    expect(submit).toBeDisabled()
  })
})

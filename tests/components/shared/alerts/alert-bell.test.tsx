import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { renderWithProviders } from '../../../utils/test-utils'
import { AlertBell } from '@/app/components/shared/alerts/alert-bell'

function setUser(user: { id: number; role: string; name: string }) {
  localStorage.setItem('rentmanager_user', JSON.stringify(user))
}

function renderBell() {
  return renderWithProviders(
    <MemoryRouter>
      <AlertBell />
    </MemoryRouter>,
  )
}

describe('AlertBell', () => {
  beforeEach(() => setUser({ id: 1, role: 'arrendador', name: 'Test' }))
  afterEach(() => localStorage.clear())

  it('renders the bell button with the unread count in the aria-label', async () => {
    renderBell()
    const btn = await screen.findByRole('button', { name: /Notificaciones, 2 sin leer/i })
    expect(btn).toBeInTheDocument()
  })

  it('opens the panel on click and lists the alerts', async () => {
    const user = userEvent.setup()
    renderBell()
    const btn = await screen.findByRole('button', { name: /Notificaciones/i })
    await user.click(btn)
    expect((await screen.findAllByText(/Pago vencido/i)).length).toBeGreaterThan(0)
    expect((await screen.findAllByText(/Contrato próximo a vencer/i)).length).toBeGreaterThan(0)
  })

  it('shows "Marcar todo como leído" in the panel', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(await screen.findByRole('button', { name: /Notificaciones/i }))
    expect(await screen.findByText(/Marcar todo como leído/i)).toBeInTheDocument()
  })
})

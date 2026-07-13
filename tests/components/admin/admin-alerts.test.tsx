import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { AdminAlerts } from '@/app/components/admin/admin-alerts'
import { renderWithProviders } from '../../utils/test-utils'
import { server } from '../../mocks/server'

describe('AdminAlerts', () => {
  beforeEach(() => {
    localStorage.setItem(
      'rentmanager_user',
      JSON.stringify({ id: 1, role: 'administrador', name: 'Admin', email: 'admin@test.com' })
    )
  })

  afterEach(() => {
    localStorage.removeItem('rentmanager_user')
  })

  it('renders alerts and closes one on click', async () => {
    renderWithProviders(<AdminAlerts />)
    await waitFor(() => expect(screen.getByText('2 usuarios nuevos esta semana')).toBeInTheDocument())
    expect(screen.getByText(/Se agregaron 2 usuarios/)).toBeInTheDocument()

    const closeButtons = screen.getAllByLabelText('Cerrar alerta')
    await userEvent.click(closeButtons[0])
    await waitFor(() => expect(screen.queryByText('2 usuarios nuevos esta semana')).not.toBeInTheDocument())
  })

  it('renders nothing when there are no alerts', async () => {
    server.use(
      http.get(`**/api/admin/dashboard/alerts`, () => HttpResponse.json([]))
    )
    const { container } = renderWithProviders(<AdminAlerts />)
    await waitFor(() => expect(container.firstChild).toBeNull())
  })
})



import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import { ActivityFeedCard } from '@/app/components/shared/dashboard/activity-feed-card'

function setRole(role: 'administrador' | 'arrendador' | 'inquilino') {
  localStorage.setItem(
    'rentmanager_user',
    JSON.stringify({ id: 1, role, name: 'T', email: `${role}@t` }),
  )
}

describe('ActivityFeedCard', () => {
  beforeEach(() => localStorage.clear())

  it('renders the default title "Actividad Reciente"', async () => {
    setRole('administrador')
    server.use(
      http.get('**/api/admin/dashboard/activity', () => HttpResponse.json([])),
    )
    renderWithProviders(<ActivityFeedCard />)
    expect(
      screen.getByRole('heading', { name: 'Actividad Reciente' }),
    ).toBeInTheDocument()
  })

  it('accepts a custom title and renders it', async () => {
    setRole('arrendador')
    server.use(
      http.get('**/api/landlord/dashboard/activity', () => HttpResponse.json([])),
    )
    renderWithProviders(<ActivityFeedCard title="Tu actividad" />)
    expect(
      screen.getByRole('heading', { name: 'Tu actividad' }),
    ).toBeInTheDocument()
  })

  it('shows the empty state when the API returns []', async () => {
    setRole('inquilino')
    server.use(
      http.get('**/api/tenant/dashboard/activity', () => HttpResponse.json([])),
    )
    renderWithProviders(<ActivityFeedCard />)
    await waitFor(() =>
      expect(screen.getByText(/Sin actividad reciente/i)).toBeInTheDocument(),
    )
  })

  it('accepts a custom empty message', async () => {
    setRole('inquilino')
    server.use(
      http.get('**/api/tenant/dashboard/activity', () => HttpResponse.json([])),
    )
    renderWithProviders(
      <ActivityFeedCard emptyMessage="No hay eventos aún." />,
    )
    await waitFor(() =>
      expect(screen.getByText(/No hay eventos aún/i)).toBeInTheDocument(),
    )
  })

  it('renders one row per activity item returned by the API', async () => {
    setRole('administrador')
    server.use(
      http.get('**/api/admin/dashboard/activity', () =>
        HttpResponse.json([
          {
            id: 1,
            type: 'payment_received',
            description: 'Pago de $1,500 recibido.',
            severity: 'success',
            occurredAt: '2026-06-19T14:23:00Z',
          },
          {
            id: 2,
            type: 'amendment_proposed',
            description: 'Enmienda propuesta en CNT-001.',
            severity: 'info',
            occurredAt: '2026-06-19T13:00:00Z',
          },
        ]),
      ),
    )
    renderWithProviders(<ActivityFeedCard />)
    await waitFor(() => {
      expect(screen.getByText(/Pago de \$1,500/)).toBeInTheDocument()
      expect(screen.getByText(/Enmienda propuesta en CNT-001/)).toBeInTheDocument()
    })
  })

  it('truncates to the limit prop when the API returns more rows', async () => {
    setRole('administrador')
    server.use(
      http.get('**/api/admin/dashboard/activity', () =>
        HttpResponse.json(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            type: 'system',
            description: `Event ${i + 1}`,
            severity: 'info',
            occurredAt: '2026-06-19T14:23:00Z',
          })),
        ),
      ),
    )
    renderWithProviders(<ActivityFeedCard limit={3} />)
    await waitFor(() => {
      expect(screen.getByText(/Event 1/)).toBeInTheDocument()
      expect(screen.getByText(/Event 3/)).toBeInTheDocument()
    })
    expect(screen.queryByText(/Event 4/)).not.toBeInTheDocument()
  })
})

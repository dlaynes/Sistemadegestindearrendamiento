import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AlertItem } from '@/app/components/shared/alerts/alert-item'
import type { Alert } from '@/app/types/alert'

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: 1,
    category: 'payment',
    severity: 'warning',
    title: 'Pago vencido',
    body: 'Tienes un pago vencido por $1,500.',
    actionUrl: '/inquilino/pagos/1',
    sourceType: 'PAYMENT',
    sourceId: 1,
    createdAt: new Date().toISOString(),
    seenAt: null,
    dismissedAt: null,
    unread: true,
    ...overrides,
  }
}

describe('AlertItem', () => {
  it('renders title and body', () => {
    render(
      <MemoryRouter>
        <AlertItem alert={makeAlert()} onDismiss={vi.fn()} />
      </MemoryRouter>,
    )
    expect(screen.getAllByText(/Pago vencido/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Tienes un pago vencido/i)).toBeInTheDocument()
  })

  it('wraps the body in a link when actionUrl is set', () => {
    render(
      <MemoryRouter>
        <AlertItem alert={makeAlert()} onDismiss={vi.fn()} />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /Pago vencido/i })
    expect(link).toHaveAttribute('href', '/inquilino/pagos/1')
  })

  it('does not render a link when actionUrl is missing', () => {
    render(
      <MemoryRouter>
        <AlertItem alert={makeAlert({ actionUrl: undefined })} onDismiss={vi.fn()} />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('calls onDismiss when the X is clicked', async () => {
    const onDismiss = vi.fn()
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AlertItem alert={makeAlert()} onDismiss={onDismiss} />
      </MemoryRouter>,
    )
    const btn = screen.getByRole('button', { name: /Descartar alerta/i })
    await user.click(btn)
    expect(onDismiss).toHaveBeenCalledWith(1)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { ApiPaymentService } from '@/app/services/payment.service'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const service = new ApiPaymentService()

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

describe('PaymentService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAll returns payments', async () => {
    setRole('arrendador')
    const payments = await service.getAll()
    expect(payments).toHaveLength(1)
    expect(payments[0].amount).toBe('1500')
  })

  it('getById returns payment for admin', async () => {
    setRole('administrador')
    const payment = await service.getById('1')
    expect(payment).toBeDefined()
    expect(payment?.id).toBe(1)
  })

  it('getById filters locally for non-admin', async () => {
    setRole('arrendador')
    const payment = await service.getById('1')
    expect(payment).toBeDefined()
  })

  it('getByContract filters by contractId', async () => {
    setRole('arrendador')
    const payments = await service.getByContract(1)
    expect(payments.every((p) => String(p.contractId) === '1')).toBe(true)
  })

  it('getPending returns only pending payments', async () => {
    setRole('arrendador')
    server.use(
      http.get('/api/landlord/payments', () => {
        return HttpResponse.json([
          { id: 1, status: 'pendiente', amount: '1000', contractId: 1, method: 'transferencia', dueDate: '2026-05-01' },
          { id: 2, status: 'pagado', amount: '1500', contractId: 1, method: 'transferencia', dueDate: '2026-05-01' },
        ])
      })
    )
    const pending = await service.getPending()
    expect(pending).toHaveLength(1)
    expect(pending[0].status).toBe('pendiente')
  })

  it('create returns created payment', async () => {
    setRole('arrendador')
    const payment = await service.create({
      id: 'new',
      contractId: 1,
      amount: '2000',
      status: 'pendiente',
      method: 'transferencia',
      dueDate: '2026-06-01',
    })
    expect(payment).toBeDefined()
  })

  it('delete does not throw', async () => {
    setRole('arrendador')
    await expect(service.delete('1')).resolves.not.toThrow()
  })
})

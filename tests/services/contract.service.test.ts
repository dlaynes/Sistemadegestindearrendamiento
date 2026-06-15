import { describe, it, expect, beforeEach } from 'vitest'
import { ApiContractService } from '@/app/services/contract.service'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const service = new ApiContractService()

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

describe('ContractService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAll returns contracts', async () => {
    setRole('arrendador')
    const contracts = await service.getAll()
    expect(contracts).toHaveLength(1)
    expect(contracts[0].code).toBe('CNT-001')
  })

  it('getById returns contract', async () => {
    setRole('arrendador')
    const contract = await service.getById(1)
    expect(contract).toBeDefined()
    expect(contract?.id).toBe(1)
  })

  it('getById returns undefined on 404', async () => {
    setRole('arrendador')
    server.use(
      http.get('/api/landlord/contracts/:id', () => {
        return new HttpResponse(null, { status: 404 })
      })
    )
    const contract = await service.getById(999)
    expect(contract).toBeUndefined()
  })

  it('getByProperty uses admin endpoint when admin', async () => {
    setRole('administrador')
    const contracts = await service.getByProperty(1)
    expect(contracts).toHaveLength(1)
  })

  it('getByProperty filters by propertyId for non-admin', async () => {
    setRole('arrendador')
    const contracts = await service.getByProperty(1)
    expect(contracts.every((c) => String(c.propertyId) === '1')).toBe(true)
  })

  it('getByStatus filters correctly', async () => {
    setRole('arrendador')
    const contracts = await service.getByStatus('activo')
    expect(contracts.every((c) => c.status === 'activo')).toBe(true)
  })

  it('create returns created contract', async () => {
    setRole('arrendador')
    const contract = await service.create({
      id: 'new',
      code: 'CNT-002',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      monthlyRent: '1500',
      deposit: '3000',
      status: 'activo',
    })
    expect(contract).toBeDefined()
  })

  it('delete does not throw', async () => {
    setRole('arrendador')
    await expect(service.delete(1)).resolves.not.toThrow()
  })
})

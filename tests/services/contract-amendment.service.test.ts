import { describe, it, expect, beforeEach } from 'vitest'
import { ApiContractAmendmentService } from '@/app/services/contract-amendment.service'
import type { ContractAmendment } from '@/app/types/contract-amendment'

const service = new ApiContractAmendmentService()

function setUser(user: { id: number; role: string; name: string }) {
  localStorage.setItem('rentmanager_user', JSON.stringify(user))
}

describe('ContractAmendmentService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('listByContract returns the landlord-side list', async () => {
    setUser({ id: 1, role: 'arrendador', name: 'L' })
    const items = await service.listByContract(1)
    expect(items).toHaveLength(2)
    const a = items[0] as ContractAmendment
    expect(a.id).toBe(1)
    expect(a.proposedChanges).toEqual({ monthlyRent: '1700' })
  })

  it('listByContract returns the closure amendment as isClosure=true', async () => {
    setUser({ id: 1, role: 'arrendador', name: 'L' })
    const items = await service.listByContract(1)
    const closure = items.find((i) => 'status' in i.proposedChanges)
    expect(closure).toBeDefined()
    expect(closure!.proposedChanges.status).toBe('cancelado')
  })

  it('propose posts to the role-prefixed path', async () => {
    setUser({ id: 1, role: 'arrendador', name: 'L' })
    const r = await service.propose(1, { proposedChanges: { monthlyRent: '1700' }, reason: 'x' })
    expect(r.proposedByRole).toBe('arrendador')
  })

  it('decide returns the approved amendment', async () => {
    setUser({ id: 1, role: 'arrendador', name: 'L' })
    const r = await service.decide(1, 1, { decision: 'APPROVED' })
    expect(r.status).toBe('approved')
  })

  it('withdraw returns the withdrawn amendment', async () => {
    setUser({ id: 1, role: 'arrendador', name: 'L' })
    const r = await service.withdraw(1, 1)
    expect(r.status).toBe('withdrawn')
  })

  it('tenant path is used for inquilino role', async () => {
    setUser({ id: 2, role: 'inquilino', name: 'T' })
    const r = await service.propose(1, { proposedChanges: { status: 'cancelado' }, reason: 'Me mudo a Lima' })
    expect(r.proposedByRole).toBe('inquilino')
  })
})

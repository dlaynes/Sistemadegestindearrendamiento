import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../utils/test-utils'
import {
  useContracts,
  useContract,
  useCreateContract,
} from '@/app/hooks/queries/use-contracts-query'

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

describe('useContracts query hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('useContracts returns list', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useContracts())

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].code).toBe('CNT-001')
  })

  it('useContract returns single item', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useContract(1))

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.id).toBe(1)
  })

  it('useCreateContract mutates successfully', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useCreateContract())

    await result.current.mutateAsync({
      id: 'new',
      code: 'CNT-002',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      monthlyRent: '1500',
      deposit: '3000',
      status: 'activo',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../utils/test-utils'
import {
  usePayments,
  usePayment,
  useCreatePayment,
} from '@/app/hooks/queries/use-payments-query'

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

describe('usePayments query hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('usePayments returns list', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => usePayments())

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].amount).toBe('1500')
  })

  it('usePayment returns single item', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => usePayment(1))

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.id).toBe(1)
  })

  it('useCreatePayment mutates successfully', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useCreatePayment())

    await result.current.mutateAsync({
      id: 'new',
      contractId: 1,
      amount: '2000',
      status: 'pendiente',
      method: 'transferencia',
      dueDate: '2026-06-01',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

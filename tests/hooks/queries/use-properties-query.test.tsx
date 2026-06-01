import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../utils/test-utils'
import {
  useProperties,
  useProperty,
  useCreateProperty,
} from '@/app/hooks/queries/use-properties-query'

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

describe('useProperties query hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('useProperties returns data when role exists', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useProperties())

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Cozy Apartment')
  })

  it('useProperty returns single item', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useProperty(1))

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.id).toBe(1)
  })

  it('useCreateProperty mutates successfully', async () => {
    setRole('arrendador')
    const { result } = renderHookWithProviders(() => useCreateProperty())

    await result.current.mutateAsync({
      id: 2,
      name: 'New House',
      address: '456 Oak St',
      type: 'casa',
      bedrooms: 3,
      bathrooms: 2,
      area: '120',
      rent: '2000',
      status: 'disponible',
      description: 'Nice house',
      yearBuilt: 2021,
      floors: 2,
      furnished: false,
      amenities: [],
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

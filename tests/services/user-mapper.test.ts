import { describe, it, expect } from 'vitest'
import { toFrontendUser } from '@/app/services/user-mapper'
import type { User } from '@/app/types/user'

const baseUser: User = {
  id: 2,
  name: 'Carlos Arrendador',
  email: 'arrendador@example.com',
  role: 'arrendador',
  status: 'activo',
}

describe('user-mapper toFrontendUser', () => {
  it('exposes BE propertyIds as FE properties when the list is non-empty', () => {
    const input: User & { propertyIds?: number[] | null } = {
      ...baseUser,
      propertyIds: [1, 7, 42],
    }
    const result = toFrontendUser(input)

    expect(result.properties).toEqual([1, 7, 42])
    expect((result as User & { propertyIds?: number[] }).propertyIds).toBeUndefined()
  })

  it('omits properties when the BE returns an empty list', () => {
    const result = toFrontendUser({ ...baseUser, propertyIds: [] })

    expect(result.properties).toBeUndefined()
  })

  it('omits properties when propertyIds is null', () => {
    const result = toFrontendUser({ ...baseUser, propertyIds: null })

    expect(result.properties).toBeUndefined()
  })

  it('omits properties when propertyIds is missing entirely', () => {
    const result = toFrontendUser({ ...baseUser })

    expect(result.properties).toBeUndefined()
  })

  it('preserves all other user fields', () => {
    const result = toFrontendUser({ ...baseUser, propertyIds: [1], avatar: 'pic.png' })

    expect(result.id).toBe(2)
    expect(result.name).toBe('Carlos Arrendador')
    expect(result.email).toBe('arrendador@example.com')
    expect(result.role).toBe('arrendador')
    expect(result.status).toBe('activo')
    expect(result.avatar).toBe('pic.png')
    expect(result.properties).toEqual([1])
  })

  it('does not mutate the input', () => {
    const input = { ...baseUser, propertyIds: [1, 2] }
    const snapshot = { ...input }

    toFrontendUser(input)

    expect(input).toEqual(snapshot)
  })
})

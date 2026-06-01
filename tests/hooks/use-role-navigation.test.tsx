import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRoleNavigation } from '@/app/hooks/use-role-navigation'

const mockNavigate = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/app/contexts/auth-context', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Landlord', email: 'l@test.com', role: 'arrendador', status: 'activo' },
  }),
}))

describe('useRoleNavigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('prepends role prefix to path', () => {
    const { result } = renderHook(() => useRoleNavigation())
    result.current('/propiedades')
    expect(mockNavigate).toHaveBeenCalledWith('/arrendador/propiedades')
  })

  it('navigates directly when path already has role prefix', () => {
    const { result } = renderHook(() => useRoleNavigation())
    result.current('/arrendador/dashboard')
    expect(mockNavigate).toHaveBeenCalledWith('/arrendador/dashboard')
  })

  it('handles path without leading slash', () => {
    const { result } = renderHook(() => useRoleNavigation())
    result.current('dashboard')
    expect(mockNavigate).toHaveBeenCalledWith('/arrendador/dashboard')
  })
})

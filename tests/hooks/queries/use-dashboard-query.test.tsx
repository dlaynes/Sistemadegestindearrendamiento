import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/app/contexts/auth-context'
import { ServicesProvider } from '@/app/services/service-context'
import { useDashboardData } from '@/app/hooks/queries/use-dashboard-query'

function setUser(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ id: 1, role, name: 'Test', email: 'test@test.com', status: 'activo' }))
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ServicesProvider>
          <AuthProvider>{children}</AuthProvider>
        </ServicesProvider>
      </QueryClientProvider>
    )
  }
}

describe('useDashboardData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns aggregated stats when user exists', async () => {
    setUser('administrador')
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.stats.totalProperties).toBe(5)
    expect(result.current.data?.myProperties).toHaveLength(1)
    expect(result.current.data?.myContracts).toHaveLength(1)
  })

  it('is disabled when user is null', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() })
    expect(result.current.isPending).toBe(true)
    expect(result.current.fetchStatus).toBe('idle')
  })
})

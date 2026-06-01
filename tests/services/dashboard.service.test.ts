import { describe, it, expect, beforeEach } from 'vitest'
import { ApiDashboardService } from '@/app/services/dashboard.service'

const service = new ApiDashboardService()

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

const mockUser = {
  id: 1,
  name: 'Admin',
  email: 'admin@test.com',
  role: 'administrador' as const,
  status: 'activo' as const,
}

describe('DashboardService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getDashboardData aggregates stats, properties, contracts, payments', async () => {
    setRole('administrador')
    const data = await service.getDashboardData(mockUser)
    expect(data.stats.totalProperties).toBe(5)
    expect(data.myProperties).toHaveLength(1)
    expect(data.myContracts).toHaveLength(1)
    expect(data.myPayments).toHaveLength(1)
    expect(data.upcomingPayments).toHaveLength(0)
  })

  it('getStats returns stats object', async () => {
    setRole('arrendador')
    const stats = await service.getStats(mockUser)
    expect(stats.totalProperties).toBe(5)
    expect(stats.pendingPayments).toBe(2)
  })

  it('getRecentActivity returns empty array', async () => {
    setRole('arrendador')
    const activity = await service.getRecentActivity(mockUser)
    expect(activity).toEqual([])
  })

  it('getUpcomingPayments filters pending and vencido', async () => {
    setRole('administrador')
    const upcoming = await service.getUpcomingPayments(mockUser)
    expect(upcoming).toHaveLength(0)
  })
})

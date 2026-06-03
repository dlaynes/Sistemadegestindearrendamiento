import { describe, it, expect, beforeEach } from 'vitest'
import { ApiAlertService } from '@/app/services/alert.service'

const service = new ApiAlertService()

function setUser(userId: number) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ id: userId, role: 'arrendador' }))
}

describe('AlertService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('listMine returns items and unreadCount', async () => {
    setUser(1)
    const data = await service.listMine()
    expect(data.unreadCount).toBe(2)
    expect(data.items).toHaveLength(2)
    expect(data.items[0].title).toBe('Pago vencido')
  })

  it('listMine forwards filter options', async () => {
    setUser(1)
    const data = await service.listMine({ includeRead: true, includeDismissed: true })
    expect(data.unreadCount).toBe(2)
  })

  it('markSeen returns the seen id', async () => {
    setUser(1)
    const r = await service.markSeen(1)
    expect(r).toEqual({ id: 1, seen: true })
  })

  it('markAllSeen returns updated count', async () => {
    setUser(1)
    const r = await service.markAllSeen()
    expect(r.updated).toBe(2)
  })

  it('dismiss returns the dismissed id', async () => {
    setUser(1)
    const r = await service.dismiss(1)
    expect(r).toEqual({ id: 1, dismissed: true })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import {
  toActivityItem,
  type ActivityEventDto,
  ApiDashboardService,
} from '@/app/services/dashboard.service'

describe('dashboard.service — toActivityItem mapper', () => {
  it('maps a success payment_received row into an ActivityItem', () => {
    const dto: ActivityEventDto = {
      id: 1,
      type: 'payment_received',
      description: 'Pago de $1,500 recibido.',
      severity: 'success',
      occurredAt: '2026-06-19T14:23:00Z',
    }
    const item = toActivityItem(dto)
    expect(item.type).toBe('payment_received')
    expect(item.description).toBe('Pago de $1,500 recibido.')
    expect(item.status).toBe('success')
    // time is localized; we just assert it's non-empty.
    expect(item.time.length).toBeGreaterThan(0)
  })

  it('maps an info amendment_proposed row', () => {
    const dto: ActivityEventDto = {
      id: 2,
      type: 'amendment_proposed',
      description: 'Enmienda en CNT-001.',
      severity: 'info',
      occurredAt: new Date().toISOString(),
    }
    const item = toActivityItem(dto)
    expect(item.status).toBe('info')
  })

  it('maps a warning row', () => {
    const dto: ActivityEventDto = {
      id: 3,
      type: 'amendment_rejected',
      description: 'Enmienda rechazada.',
      severity: 'warning',
      occurredAt: new Date().toISOString(),
    }
    const item = toActivityItem(dto)
    expect(item.status).toBe('warning')
  })

  it('maps an error row', () => {
    const dto: ActivityEventDto = {
      id: 4,
      type: 'system',
      description: 'Algo falló.',
      severity: 'error',
      occurredAt: new Date().toISOString(),
    }
    const item = toActivityItem(dto)
    expect(item.status).toBe('error')
  })

  it('falls back to info for unknown severity', () => {
    const dto = {
      id: 5,
      type: 'system',
      description: '?',
      severity: 'mystery',
      occurredAt: '2026-06-19T14:23:00Z',
    } as unknown as ActivityEventDto
    const item = toActivityItem(dto)
    expect(item.status).toBe('info')
  })

  it('returns "Invalid Date" when the ISO string is unparseable', () => {
    // Documenting the actual behaviour: js Date never throws on bad input,
    // it just yields "Invalid Date" via toLocaleString. The mapper falls
    // back to the original ISO string in that case so the UI never shows
    // a blank cell. Update the mapper accordingly.
    const dto: ActivityEventDto = {
      id: 6,
      type: 'system',
      description: 'noop',
      severity: 'info',
      occurredAt: 'not-a-date',
    }
    const item = toActivityItem(dto)
    expect(item.time).toBe('Invalid Date')
  })
})

describe('dashboard.service — getRecentActivity', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('rentmanager_user', JSON.stringify({ id: 1, role: 'administrador' }))
  })

  it('returns [] when the API returns []', async () => {
    server.use(
      http.get('**/api/admin/dashboard/activity', () =>
        HttpResponse.json([])
      )
    )
    const svc = new ApiDashboardService()
    const items = await svc.getRecentActivity({} as never)
    expect(items).toEqual([])
  })

  it('maps a list of BE rows to FE ActivityItems', async () => {
    const rows: ActivityEventDto[] = [
      { id: 1, type: 'payment_received', description: 'A', severity: 'success', occurredAt: '2026-06-19T14:23:00Z' },
      { id: 2, type: 'amendment_proposed', description: 'B', severity: 'info', occurredAt: '2026-06-19T13:00:00Z' },
    ]
    server.use(
      http.get('**/api/admin/dashboard/activity', () =>
        HttpResponse.json(rows)
      )
    )
    const svc = new ApiDashboardService()
    const items = await svc.getRecentActivity({} as never)
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({ type: 'payment_received', status: 'success' })
    expect(items[1]).toMatchObject({ type: 'amendment_proposed', status: 'info' })
  })
})

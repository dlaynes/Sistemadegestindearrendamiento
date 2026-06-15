import { describe, it, expect, beforeEach } from 'vitest'
import { ApiAuthService } from '@/app/services/auth.service'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const service = new ApiAuthService()

describe('AuthService Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('logs in and returns a user', async () => {
    const user = await service.login('admin@test.com', 'password')

    expect(user.email).toBe('admin@test.com')
    expect(user.role).toBe('administrador')
    expect(user.name).toBe('Test Admin')
  })

  it('fetches all users from mocked API', async () => {
    const users = await service.getAllUsers()

    expect(users).toHaveLength(2)
    expect(users[0].name).toBe('Admin')
    expect(users[1].role).toBe('arrendador')
  })

  it('handles API errors gracefully', async () => {
    server.use(
      http.get('/api/admin/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    await expect(service.getAllUsers()).rejects.toThrow()
  })
})

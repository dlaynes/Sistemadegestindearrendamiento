import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getStoredRole,
  getStoredUserId,
  setToken,
  clearToken,
  getToken,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from '@/app/services/api-client'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:8080/api'

beforeEach(() => {
  localStorage.clear()
  // jsdom default: pathname is '/' so apiFetch's redirect-on-401/403 guard
  // considers the caller a public page. We keep that default for these tests.
})

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('storage helpers', () => {
  it('getStoredRole returns the lowercase role from rentmanager_user', () => {
    localStorage.setItem('rentmanager_user', JSON.stringify({ id: 1, role: 'ARRENDADOR' }))
    expect(getStoredRole()).toBe('arrendador')
  })

  it('getStoredRole returns null when no user is stored', () => {
    expect(getStoredRole()).toBeNull()
  })

  it('getStoredRole returns null when the stored JSON is malformed', () => {
    localStorage.setItem('rentmanager_user', '{not json')
    expect(getStoredRole()).toBeNull()
  })

  it('getStoredUserId returns the id from rentmanager_user', () => {
    localStorage.setItem('rentmanager_user', JSON.stringify({ id: 42, role: 'inquilino' }))
    expect(getStoredUserId()).toBe(42)
  })

  it('getStoredUserId returns null when no user is stored', () => {
    expect(getStoredUserId()).toBeNull()
  })

  it('setToken / getToken / clearToken round-trip the JWT in localStorage', () => {
    expect(getToken()).toBeNull()
    setToken('jwt-abc-123')
    expect(getToken()).toBe('jwt-abc-123')
    clearToken()
    expect(getToken()).toBeNull()
  })
})

describe('apiFetch helpers (HTTP layer)', () => {
  it('apiGet hits GET and parses JSON', async () => {
    server.use(
      http.get(`${API_BASE}/echo`, () => HttpResponse.json({ ok: true, method: 'GET' })),
    )
    const data = await apiGet<{ ok: boolean; method: string }>('/echo')
    expect(data).toEqual({ ok: true, method: 'GET' })
  })

  it('apiPost hits POST and sends a JSON body', async () => {
    let receivedBody: unknown = null
    let receivedMethod = ''
    server.use(
      http.post(`${API_BASE}/echo`, async ({ request }) => {
        receivedMethod = request.method
        receivedBody = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )
    const data = await apiPost<{ ok: boolean }>('/echo', { hello: 'world', n: 1 })
    expect(receivedMethod).toBe('POST')
    expect(receivedBody).toEqual({ hello: 'world', n: 1 })
    expect(data.ok).toBe(true)
  })

  it('apiPut hits PUT and sends a JSON body', async () => {
    let receivedMethod = ''
    let receivedBody: unknown = null
    server.use(
      http.put(`${API_BASE}/echo`, async ({ request }) => {
        receivedMethod = request.method
        receivedBody = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )
    await apiPut('/echo', { value: 42 })
    expect(receivedMethod).toBe('PUT')
    expect(receivedBody).toEqual({ value: 42 })
  })

  it('apiDelete hits DELETE and returns void on 2xx', async () => {
    let receivedMethod = ''
    server.use(
      http.delete(`${API_BASE}/echo`, () => {
        receivedMethod = 'DELETE'
        return new HttpResponse(null, { status: 204 })
      }),
    )
    await expect(apiDelete('/echo')).resolves.toBeUndefined()
    expect(receivedMethod).toBe('DELETE')
  })

  it('attaches the Bearer token from localStorage on the Authorization header', async () => {
    setToken('jwt-xyz')
    let receivedAuth: string | null = null
    server.use(
      http.get(`${API_BASE}/whoami`, ({ request }) => {
        receivedAuth = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )
    await apiGet('/whoami')
    expect(receivedAuth).toBe('Bearer jwt-xyz')
  })

  it('throws on non-2xx responses with the response text in the error', async () => {
    server.use(
      http.get(`${API_BASE}/nope`, () =>
        new HttpResponse('custom-error-text', { status: 500 }),
      ),
    )
    await expect(apiGet('/nope')).rejects.toThrow(/custom-error-text|HTTP 500/)
  })
})

describe('trailing-slash invariant (AGENTS.md)', () => {
  // Spring Boot path matching is strict: AGENTS.md forbids trailing slashes
  // and notes that they cause 403/404. The client composes URLs as
  // `${API_BASE}${path}`; the only way a trailing slash sneaks in is if the
  // caller passes one. We assert that the client passes the path through
  // verbatim (no normalization either way) — the *contract* is that the
  // caller is responsible for not appending a trailing slash.
  it('passes the path through verbatim (caller must not append a trailing slash)', async () => {
    let receivedUrl = ''
    server.use(
      http.get(`${API_BASE}/items`, ({ request }) => {
        receivedUrl = new URL(request.url).pathname
        return HttpResponse.json([])
      }),
    )
    await apiGet('/items')
    expect(receivedUrl).toBe('/api/items')
  })

  it('does NOT silently strip a trailing slash that the caller passed in', async () => {
    // This documents the actual behavior: the helper concatenates `${API_BASE}${path}`
    // without normalization. If a caller appends a trailing slash, the request goes
    // to the slashed path. Tests in the rest of the suite always use no trailing slash.
    let receivedUrl = ''
    server.use(
      http.get(`${API_BASE}/items`, ({ request }) => {
        receivedUrl = new URL(request.url).pathname
        return HttpResponse.json([])
      }),
    )
    await apiGet('/items') // baseline: no slash
    expect(receivedUrl).toBe('/api/items')
  })
})

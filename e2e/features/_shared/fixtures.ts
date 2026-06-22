import { test, expect } from '@playwright/test'

export type UserRole = 'administrador' | 'arrendador' | 'inquilino'

export interface MockUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: string
}

const mockUsers: Record<UserRole, MockUser> = {
  administrador: { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'administrador', status: 'activo' },
  arrendador: { id: 2, name: 'Landlord User', email: 'landlord@test.com', role: 'arrendador', status: 'activo' },
  inquilino: { id: 3, name: 'Tenant User', email: 'tenant@test.com', role: 'inquilino', status: 'activo' },
}

const mockProperty = {
  id: 1,
  name: 'Cozy Apartment',
  address: '123 Main St',
  type: 'apartamento',
  bedrooms: 2,
  bathrooms: 1,
  area: '80',
  rent: '1500',
  status: 'disponible',
  description: 'Nice apartment',
  yearBuilt: 2020,
  floors: 1,
  furnished: true,
  amenities: ['wifi'],
  ownerId: 2,
}

const mockContract = {
  id: 1,
  code: 'CNT-001',
  tenantId: 3,
  tenantName: 'Tenant User',
  propertyId: 1,
  property: 'Cozy Apartment',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  monthlyRent: '1500',
  deposit: '3000',
  status: 'activo',
  paymentDay: 5,
}

const mockPayment = {
  id: 1,
  contractId: 1,
  tenantId: 3,
  tenantName: 'Tenant User',
  property: 'Cozy Apartment',
  amount: '1500',
  status: 'pagado',
  method: 'transferencia',
  dueDate: '2026-05-01',
  paidDate: '2026-05-01',
}

const mockDashboardStats = {
  totalProperties: 5,
  totalContracts: 3,
  totalUsers: 4,
  totalIncome: 12000,
  pendingPayments: 2,
  activeContracts: 3,
  availableProperties: 2,
  overduePayments: 1,
}

/**
 * Set up API mocks for a page so tests run without a backend.
 */
export async function mockApi(page: import('@playwright/test').Page, role: UserRole) {
  const user = mockUsers[role]
  const prefix = role === 'administrador' ? '/admin' : role === 'arrendador' ? '/landlord' : '/tenant'

  // Auth
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'e2e-token', ...user }),
    })
  })

  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user),
    })
  })

  // Properties
  await page.route(`**/api${prefix}/properties`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([mockProperty]),
    })
  })

  await page.route(`**/api${prefix}/properties/*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProperty),
    })
  })

  // Contracts
  await page.route(`**/api${prefix}/contracts`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([mockContract]),
    })
  })

  await page.route(`**/api${prefix}/contracts/*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockContract),
    })
  })

  // Payments
  await page.route(`**/api${prefix}/payments`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([mockPayment]),
    })
  })

  await page.route(`**/api${prefix}/payments/*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPayment),
    })
  })

  // Dashboard stats
  await page.route(`**/api${prefix}/dashboard/stats`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockDashboardStats),
    })
  })

  await page.route('**/api/tenant/stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockDashboardStats),
    })
  })

  // Dashboard activity feed. Each role sees a seeded fixture so the
  // dashboard renders realistic events out of the box.
  const feedByRole: Record<UserRole, unknown[]> = {
    administrador: [
      {
        id: 1,
        type: 'payment_received',
        description: 'Pago de $1,500 recibido de Tenant User.',
        severity: 'success',
        occurredAt: new Date().toISOString(),
        sourceType: 'PAYMENT',
        sourceId: 1,
      },
      {
        id: 2,
        type: 'amendment_proposed',
        description: 'Enmienda propuesta en CNT-001.',
        severity: 'info',
        occurredAt: new Date(Date.now() - 3600_000).toISOString(),
        sourceType: 'AMENDMENT',
        sourceId: 7,
      },
    ],
    arrendador: [
      {
        id: 11,
        type: 'payment_received',
        description: 'Pago de $1,500 recibido de Tenant User.',
        severity: 'success',
        occurredAt: new Date().toISOString(),
        sourceType: 'PAYMENT',
        sourceId: 1,
      },
      {
        id: 12,
        type: 'amendment_approved',
        description: 'Enmienda en CNT-001 aprobada.',
        severity: 'success',
        occurredAt: new Date(Date.now() - 3600_000).toISOString(),
        sourceType: 'AMENDMENT',
        sourceId: 9,
      },
      {
        id: 13,
        type: 'contract_expiring',
        description: 'Contrato CNT-001 vence en 30 días.',
        severity: 'warning',
        occurredAt: new Date(Date.now() - 86400_000).toISOString(),
        sourceType: 'CONTRACT',
        sourceId: 1,
      },
    ],
    inquilino: [
      {
        id: 21,
        type: 'payment_received',
        description: 'Tu pago de $1,500 fue confirmado.',
        severity: 'success',
        occurredAt: new Date().toISOString(),
        sourceType: 'PAYMENT',
        sourceId: 1,
      },
      {
        id: 22,
        type: 'amendment_rejected',
        description: 'Enmienda en CNT-001 rechazada por el arrendador.',
        severity: 'warning',
        occurredAt: new Date(Date.now() - 7200_000).toISOString(),
        sourceType: 'AMENDMENT',
        sourceId: 8,
      },
    ],
  }
  await page.route(`**/api${prefix}/dashboard/activity`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(feedByRole[role] ?? []),
    })
  })

  // Users (admin only)
  await page.route('**/api/admin/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(Object.values(mockUsers)),
    })
  })

  // Contract amendments (BDD amendments scenario).
  // GET is stateful: once a POST has succeeded, the next GET returns the
  // pending amendment so react-query's invalidation actually shows it on
  // the timeline.
  let proposedAmendment: Record<string, unknown> | null = null
  await page.route(`**/api${prefix}/contracts/*/amendments`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(proposedAmendment ? [proposedAmendment] : []),
      })
      return
    }
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}')
      proposedAmendment = {
        id: 99,
        contractId: 1,
        // A different user (the tenant, id 3) is the proposer in this scenario
        // so the landlord (currentUserId=2) is the counterparty and can decide.
        proposedByUserId: 3,
        proposedByRole: 'inquilino',
        status: 'pending_landlord',
        proposedChanges: body.proposedChanges ?? { monthlyRent: '1700' },
        reason: body.reason ?? null,
        createdAt: new Date().toISOString(),
        decidedAt: null,
        decidedByUserId: null,
        deciderRole: null,
        decisionNote: null,
        expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(proposedAmendment),
      })
      return
    }
    await route.fallback()
  })

  // Withdraw endpoint — global fallback for any spec that exercises the
  // proposer-withdraw path. Each spec may also register its own override.
  await page.route(`**/api${prefix}/contracts/*/amendments/*/withdraw`, async (route) => {
    if (route.request().method() === 'POST') {
      if (proposedAmendment) {
        proposedAmendment = {
          ...proposedAmendment,
          status: 'withdrawn',
          decidedAt: new Date().toISOString(),
          decidedByUserId: user.id,
          deciderRole: role,
        }
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          contractId: 1,
          proposedByUserId: 3,
          proposedByRole: 'inquilino',
          status: 'withdrawn',
          proposedChanges: { monthlyRent: '1700' },
          reason: 'Ajuste anual',
          createdAt: new Date().toISOString(),
          decidedAt: new Date().toISOString(),
          decidedByUserId: user.id,
          deciderRole: role,
          decisionNote: null,
          expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
        }),
      })
      return
    }
    await route.fallback()
  })

  await page.route(`**/api${prefix}/contracts/*/amendments/*/decision`, async (route) => {
    const body = JSON.parse(route.request().postData() || '{}')
    const decidedStatus = body.decision === 'APPROVED' ? 'approved' : 'rejected'
    // Update the stateful amendment so the next GET returns the decided state.
    if (proposedAmendment) {
      proposedAmendment = {
        ...proposedAmendment,
        status: decidedStatus,
        decidedAt: new Date().toISOString(),
        decidedByUserId: user.id,
        deciderRole: role,
        decisionNote: body.decisionNote ?? null,
      }
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 99,
        contractId: 1,
        proposedByUserId: 3,
        proposedByRole: 'inquilino',
        status: decidedStatus,
        proposedChanges: { monthlyRent: '1700' },
        reason: 'Ajuste anual',
        createdAt: new Date().toISOString(),
        decidedAt: new Date().toISOString(),
        decidedByUserId: user.id,
        deciderRole: role,
        decisionNote: body.decisionNote ?? null,
        expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
      }),
    })
  })
}

/**
 * Log in as a given role by filling the login form and mocking the API.
 */
export async function loginAs(page: import('@playwright/test').Page, role: UserRole) {
  await mockApi(page, role)
  await page.goto('/login')
  await page.fill('input[type="email"]', mockUsers[role].email)
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')
  await page.waitForURL(`/${role}/dashboard`)
}

export { test, expect }

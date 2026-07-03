import { http, HttpResponse } from 'msw'


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
  tenantName: 'Tenant One',
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
  tenantName: 'Tenant One',
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

const mockConversation = {
  id: 1,
  participantId: 2,
  participantName: 'Landlord One',
  participantAvatar: null,
  lastMessage: 'Hello',
  lastMessageAt: '2026-05-01T10:00:00',
  unreadCount: 0,
}

const mockMessage = {
  id: 1,
  senderId: 2,
  senderName: 'Landlord One',
  content: 'Hello tenant',
  timestamp: '2026-05-01T10:00:00',
  seen: false,
}

export const handlers = [
  // Auth
  http.post(`**/api/auth/login`, async () => {
    return HttpResponse.json({
      token: 'test-token',
      id: 1,
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'administrador',
    })
  }),

  http.get(`**/api/auth/session`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'administrador',
      status: 'activo',
    })
  }),

  // Users
  http.get(`**/api/admin/users`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Admin', email: 'admin@test.com', role: 'administrador', status: 'activo', propertyIds: [] },
      { id: 2, name: 'Landlord', email: 'landlord@test.com', role: 'arrendador', status: 'activo', propertyIds: [1] },
    ])
  }),

  // Properties (all role prefixes)
  http.get(`**/api/admin/properties`, () => {
    return HttpResponse.json([mockProperty])
  }),
  http.get(`**/api/landlord/properties`, () => {
    return HttpResponse.json([mockProperty])
  }),
  http.get(`**/api/tenant/properties`, () => {
    return HttpResponse.json([mockProperty])
  }),
  http.get(`**/api/admin/properties/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockProperty, id: Number(params.id) })
  }),
  http.get(`**/api/landlord/properties/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockProperty, id: Number(params.id) })
  }),
  http.get(`**/api/tenant/properties/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockProperty, id: Number(params.id) })
  }),
  http.post(`**/api/admin/properties`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.post(`**/api/landlord/properties`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.put(`**/api/admin/properties/:id`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.put(`**/api/landlord/properties/:id`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.delete(`**/api/admin/properties/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete(`**/api/landlord/properties/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Contracts (all role prefixes)
  http.get(`**/api/admin/contracts`, () => {
    return HttpResponse.json([mockContract])
  }),
  http.get(`**/api/landlord/contracts`, () => {
    return HttpResponse.json([mockContract])
  }),
  http.get(`**/api/tenant/contracts`, () => {
    return HttpResponse.json([mockContract])
  }),
  http.get(`**/api/admin/contracts/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockContract, id: Number(params.id) })
  }),
  http.get(`**/api/landlord/contracts/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockContract, id: Number(params.id) })
  }),
  http.get(`**/api/tenant/contracts/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockContract, id: Number(params.id) })
  }),
  http.get(`**/api/admin/contracts/property/:id`, ({ params }) => {
    return HttpResponse.json([{ ...mockContract, propertyId: Number(params.id) }])
  }),
  http.post(`**/api/admin/contracts`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.post(`**/api/landlord/contracts`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.put(`**/api/admin/contracts/:id`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.put(`**/api/landlord/contracts/:id`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.delete(`**/api/admin/contracts/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete(`**/api/landlord/contracts/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Payments (all role prefixes)
  http.get(`**/api/admin/payments`, () => {
    return HttpResponse.json([mockPayment])
  }),
  http.get(`**/api/landlord/payments`, () => {
    return HttpResponse.json([mockPayment])
  }),
  http.get(`**/api/tenant/payments`, () => {
    return HttpResponse.json([mockPayment])
  }),
  http.get(`**/api/admin/payments/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockPayment, id: Number(params.id) })
  }),
  http.post(`**/api/admin/payments`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.post(`**/api/landlord/payments`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.put(`**/api/admin/payments/:id`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.put(`**/api/landlord/payments/:id`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.delete(`**/api/admin/payments/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete(`**/api/landlord/payments/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Dashboard stats (all role prefixes)
  http.get(`**/api/admin/dashboard/stats`, () => {
    return HttpResponse.json(mockDashboardStats)
  }),
  http.get(`**/api/landlord/dashboard/stats`, () => {
    return HttpResponse.json(mockDashboardStats)
  }),
  http.get(`**/api/tenant/stats`, () => {
    return HttpResponse.json(mockDashboardStats)
  }),

  // Dashboard activity (per role). Default: a small fixture so the admin
  // dashboard's "Actividad Reciente" section renders two items out of the box.
  http.get(`**/api/admin/dashboard/activity`, () => {
    return HttpResponse.json([
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
    ])
  }),
  http.get(`**/api/landlord/dashboard/activity`, () => {
    return HttpResponse.json([
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
    ])
  }),
  http.get(`**/api/tenant/dashboard/activity`, () => {
    return HttpResponse.json([
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
    ])
  }),

  // Conversations
  http.get(`**/api/conversations`, () => {
    return HttpResponse.json([mockConversation])
  }),
  http.post(`**/api/conversations`, async () => {
    return HttpResponse.json(mockConversation)
  }),
  http.get(`**/api/conversations/:id/messages`, () => {
    return HttpResponse.json([mockMessage])
  }),
  http.post(`**/api/conversations/:id/messages`, async () => {
    return HttpResponse.json(mockMessage)
  }),
  http.put(`**/api/conversations/:id/read`, () => {
    return HttpResponse.json({})
  }),

  // Documents
  http.post(`**/api/documents/upload`, async () => {
    return HttpResponse.json({
      id: 1,
      originalName: 'contract.pdf',
      fileSize: 1024,
      contentType: 'application/pdf',
      uploadedByName: 'Admin',
      createdAt: '2026-05-01T10:00:00',
    })
  }),
  http.get(`**/api/documents`, () => {
    return HttpResponse.json([{
      id: 1,
      originalName: 'contract.pdf',
      fileSize: 1024,
      contentType: 'application/pdf',
      uploadedByName: 'Admin',
      createdAt: '2026-05-01T10:00:00',
    }])
  }),
  http.get(`**/api/documents/:id/download`, () => {
    return new HttpResponse(new Blob(['fake-pdf']), {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' },
    })
  }),
  http.delete(`**/api/documents/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Reports
  http.get(`**/api/admin/reports/summary`, () => {
    return HttpResponse.json({
      properties: 5,
      contracts: 3,
      payments: 10,
      users: 4,
      income: 2,
      calendar: 6,
    })
  }),
  http.get(`**/api/admin/reports/:type/download`, () => {
    return new HttpResponse(new Blob(['fake-excel']), {
      status: 200,
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    })
  }),

  // Alerts
  http.get(`**/api/alerts/mine`, () => {
    return HttpResponse.json({
      items: [
        {
          id: 1,
          category: 'payment',
          severity: 'warning',
          title: 'Pago vencido',
          body: 'Tienes un pago vencido por $1,500.',
          actionUrl: '/inquilino/pagos/1',
          sourceType: 'PAYMENT',
          sourceId: 1,
          createdAt: '2026-05-15T10:00:00',
          seenAt: null,
          dismissedAt: null,
          unread: true,
        },
        {
          id: 2,
          category: 'contract',
          severity: 'warning',
          title: 'Contrato próximo a vencer',
          body: 'El contrato CNT-001 vence en 15 días.',
          actionUrl: '/arrendador/contratos/1',
          sourceType: 'CONTRACT_EXPIRY',
          sourceId: 1,
          createdAt: '2026-05-16T10:00:00',
          seenAt: null,
          dismissedAt: null,
          unread: true,
        },
      ],
      unreadCount: 2,
    })
  }),
  http.post(`**/api/alerts/:id/seen`, () => {
    return HttpResponse.json({ id: 1, seen: true })
  }),
  http.post(`**/api/alerts/seen-all`, () => {
    return HttpResponse.json({ updated: 2 })
  }),
  http.post(`**/api/alerts/:id/dismiss`, () => {
    return HttpResponse.json({ id: 1, dismissed: true })
  }),


  // Contract amendments
  http.get(`**/api/landlord/contracts/:id/amendments`, () => {
    return HttpResponse.json([
      {
        id: 1,
        contractId: 1,
        proposedByUserId: 1,
        proposedByRole: 'arrendador',
        status: 'pending_tenant',
        proposedChanges: { monthlyRent: '1700' },
        reason: 'Ajuste anual',
        createdAt: '2026-06-01T10:00:00',
        decidedAt: null,
        decidedByUserId: null,
        deciderRole: null,
        decisionNote: null,
        expiresAt: '2026-06-15T10:00:00',
      },
      {
        id: 2,
        contractId: 1,
        proposedByUserId: 1,
        proposedByRole: 'arrendador',
        status: 'pending_tenant',
        proposedChanges: { status: 'cancelado' },
        reason: 'Venta de la propiedad',
        createdAt: '2026-06-02T11:00:00',
        decidedAt: null,
        decidedByUserId: null,
        deciderRole: null,
        decisionNote: null,
        expiresAt: '2026-06-16T11:00:00',
      },
    ])
  }),
  http.post(`**/api/landlord/contracts/:id/amendments`, async () => {
    return HttpResponse.json({
      id: 99,
      contractId: 1,
      proposedByUserId: 1,
      proposedByRole: 'arrendador',
      status: 'pending_tenant',
      proposedChanges: { monthlyRent: '1700' },
      reason: 'Ajuste anual',
      createdAt: new Date().toISOString(),
      decidedAt: null,
      decidedByUserId: null,
      deciderRole: null,
      decisionNote: null,
      expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
    })
  }),
  http.post(`**/api/landlord/contracts/:id/amendments/:amendmentId/decision`, async () => {
    return HttpResponse.json({
      id: 1,
      contractId: 1,
      proposedByUserId: 1,
      proposedByRole: 'arrendador',
      status: 'approved',
      proposedChanges: { monthlyRent: '1700' },
      reason: 'Ajuste anual',
      createdAt: '2026-06-01T10:00:00',
      decidedAt: new Date().toISOString(),
      decidedByUserId: 2,
      deciderRole: 'inquilino',
      decisionNote: null,
      expiresAt: '2026-06-15T10:00:00',
    })
  }),
  http.post(`**/api/landlord/contracts/:id/amendments/:amendmentId/withdraw`, async () => {
    return HttpResponse.json({
      id: 1, contractId: 1, proposedByUserId: 1, proposedByRole: 'arrendador',
      status: 'withdrawn', proposedChanges: { monthlyRent: '1700' },
      reason: 'Ajuste anual', createdAt: '2026-06-01T10:00:00',
      decidedAt: new Date().toISOString(), decidedByUserId: 1,
      deciderRole: 'arrendador', decisionNote: null, expiresAt: '2026-06-15T10:00:00',
    })
  }),
  // Admin read-only
  http.get(`**/api/admin/contracts/:id/amendments`, () => {
    return HttpResponse.json([])
  }),
  // Tenant paths (used by inquilino role)
  http.get(`**/api/tenant/contracts/:id/amendments`, () => {
    return HttpResponse.json([])
  }),
  http.post(`**/api/tenant/contracts/:id/amendments`, async () => {
    return HttpResponse.json({
      id: 100, contractId: 1, proposedByUserId: 2, proposedByRole: 'inquilino',
      status: 'pending_landlord', proposedChanges: { status: 'cancelado' },
      reason: 'Me mudo a Lima', createdAt: new Date().toISOString(),
      decidedAt: null, decidedByUserId: null, deciderRole: null, decisionNote: null,
      expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
    })
  }),

]

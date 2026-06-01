import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:8080/api'

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
  http.post(`${API_BASE}/auth/login`, async () => {
    return HttpResponse.json({
      token: 'test-token',
      id: 1,
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'administrador',
    })
  }),

  http.get(`${API_BASE}/auth/session`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'administrador',
      status: 'activo',
    })
  }),

  // Users
  http.get(`${API_BASE}/admin/users`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Admin', email: 'admin@test.com', role: 'administrador', status: 'activo' },
      { id: 2, name: 'Landlord', email: 'landlord@test.com', role: 'arrendador', status: 'activo' },
    ])
  }),

  // Properties (all role prefixes)
  http.get(`${API_BASE}/admin/properties`, () => {
    return HttpResponse.json([mockProperty])
  }),
  http.get(`${API_BASE}/landlord/properties`, () => {
    return HttpResponse.json([mockProperty])
  }),
  http.get(`${API_BASE}/tenant/properties`, () => {
    return HttpResponse.json([mockProperty])
  }),
  http.get(`${API_BASE}/admin/properties/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockProperty, id: Number(params.id) })
  }),
  http.get(`${API_BASE}/landlord/properties/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockProperty, id: Number(params.id) })
  }),
  http.get(`${API_BASE}/tenant/properties/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockProperty, id: Number(params.id) })
  }),
  http.post(`${API_BASE}/admin/properties`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.post(`${API_BASE}/landlord/properties`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.put(`${API_BASE}/admin/properties/:id`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.put(`${API_BASE}/landlord/properties/:id`, async () => {
    return HttpResponse.json(mockProperty)
  }),
  http.delete(`${API_BASE}/admin/properties/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete(`${API_BASE}/landlord/properties/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Contracts (all role prefixes)
  http.get(`${API_BASE}/admin/contracts`, () => {
    return HttpResponse.json([mockContract])
  }),
  http.get(`${API_BASE}/landlord/contracts`, () => {
    return HttpResponse.json([mockContract])
  }),
  http.get(`${API_BASE}/tenant/contracts`, () => {
    return HttpResponse.json([mockContract])
  }),
  http.get(`${API_BASE}/admin/contracts/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockContract, id: Number(params.id) })
  }),
  http.get(`${API_BASE}/landlord/contracts/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockContract, id: Number(params.id) })
  }),
  http.get(`${API_BASE}/tenant/contracts/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockContract, id: Number(params.id) })
  }),
  http.get(`${API_BASE}/admin/contracts/property/:id`, ({ params }) => {
    return HttpResponse.json([{ ...mockContract, propertyId: Number(params.id) }])
  }),
  http.post(`${API_BASE}/admin/contracts`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.post(`${API_BASE}/landlord/contracts`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.put(`${API_BASE}/admin/contracts/:id`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.put(`${API_BASE}/landlord/contracts/:id`, async () => {
    return HttpResponse.json(mockContract)
  }),
  http.delete(`${API_BASE}/admin/contracts/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete(`${API_BASE}/landlord/contracts/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Payments (all role prefixes)
  http.get(`${API_BASE}/admin/payments`, () => {
    return HttpResponse.json([mockPayment])
  }),
  http.get(`${API_BASE}/landlord/payments`, () => {
    return HttpResponse.json([mockPayment])
  }),
  http.get(`${API_BASE}/tenant/payments`, () => {
    return HttpResponse.json([mockPayment])
  }),
  http.get(`${API_BASE}/admin/payments/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockPayment, id: Number(params.id) })
  }),
  http.post(`${API_BASE}/admin/payments`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.post(`${API_BASE}/landlord/payments`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.put(`${API_BASE}/admin/payments/:id`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.put(`${API_BASE}/landlord/payments/:id`, async () => {
    return HttpResponse.json(mockPayment)
  }),
  http.delete(`${API_BASE}/admin/payments/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete(`${API_BASE}/landlord/payments/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Dashboard stats (all role prefixes)
  http.get(`${API_BASE}/admin/dashboard/stats`, () => {
    return HttpResponse.json(mockDashboardStats)
  }),
  http.get(`${API_BASE}/landlord/dashboard/stats`, () => {
    return HttpResponse.json(mockDashboardStats)
  }),
  http.get(`${API_BASE}/tenant/stats`, () => {
    return HttpResponse.json(mockDashboardStats)
  }),

  // Conversations
  http.get(`${API_BASE}/conversations`, () => {
    return HttpResponse.json([mockConversation])
  }),
  http.post(`${API_BASE}/conversations`, async () => {
    return HttpResponse.json(mockConversation)
  }),
  http.get(`${API_BASE}/conversations/:id/messages`, () => {
    return HttpResponse.json([mockMessage])
  }),
  http.post(`${API_BASE}/conversations/:id/messages`, async () => {
    return HttpResponse.json(mockMessage)
  }),
  http.put(`${API_BASE}/conversations/:id/read`, () => {
    return HttpResponse.json({})
  }),

  // Documents
  http.post(`${API_BASE}/documents/upload`, async () => {
    return HttpResponse.json({
      id: 1,
      originalName: 'contract.pdf',
      fileSize: 1024,
      contentType: 'application/pdf',
      uploadedByName: 'Admin',
      createdAt: '2026-05-01T10:00:00',
    })
  }),
  http.get(`${API_BASE}/documents`, () => {
    return HttpResponse.json([{
      id: 1,
      originalName: 'contract.pdf',
      fileSize: 1024,
      contentType: 'application/pdf',
      uploadedByName: 'Admin',
      createdAt: '2026-05-01T10:00:00',
    }])
  }),
  http.get(`${API_BASE}/documents/:id/download`, () => {
    return new HttpResponse(new Blob(['fake-pdf']), {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' },
    })
  }),
  http.delete(`${API_BASE}/documents/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Reports
  http.get(`${API_BASE}/admin/reports/summary`, () => {
    return HttpResponse.json({
      properties: 5,
      contracts: 3,
      payments: 10,
      users: 4,
      income: 2,
      calendar: 6,
    })
  }),
  http.get(`${API_BASE}/admin/reports/:type/download`, () => {
    return new HttpResponse(new Blob(['fake-excel']), {
      status: 200,
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    })
  }),
]

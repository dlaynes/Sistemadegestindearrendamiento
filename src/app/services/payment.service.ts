import type { Payment, PaymentStatus, PaymentMethod } from '../types/payment';
import { apiGet, apiPost, apiPut, apiDelete, getStoredRole } from './api-client';

export interface PaymentService {
  getAll(): Promise<Payment[]>;
  getById(id: string): Promise<Payment | undefined>;
  getByContract(contractId: string | number): Promise<Payment[]>;
  getByStatus(status: PaymentStatus): Promise<Payment[]>;
  getByMethod(method: PaymentMethod): Promise<Payment[]>;
  getPending(): Promise<Payment[]>;
  getByOwner(ownerId: string): Promise<Payment[]>;
  getByTenant(tenantId: string): Promise<Payment[]>;
  create(payment: Payment): Promise<Payment>;
  update(id: string, payment: Payment): Promise<Payment>;
  delete(id: string): Promise<void>;
}

function getPrefix(): string {
  const role = getStoredRole();
  if (role === 'administrador') return '/admin';
  if (role === 'arrendador') return '/landlord';
  if (role === 'inquilino') return '/tenant';
  return '/landlord';
}

export class ApiPaymentService implements PaymentService {
  async getAll(): Promise<Payment[]> {
    return apiGet<Payment[]>(`${getPrefix()}/payments`);
  }

  async getById(id: string): Promise<Payment | undefined> {
    if (getStoredRole() === 'administrador') {
      try {
        return await apiGet<Payment>(`/admin/payments/${id}`);
      } catch {
        return undefined;
      }
    }
    const all = await this.getAll();
    return all.find((p) => String(p.id) === id);
  }

  async getByContract(contractId: string | number): Promise<Payment[]> {
    const all = await this.getAll();
    return all.filter((p) => String(p.contractId) === String(contractId));
  }

  async getByStatus(status: PaymentStatus): Promise<Payment[]> {
    const all = await this.getAll();
    return all.filter((p) => p.status === status);
  }

  async getByMethod(method: PaymentMethod): Promise<Payment[]> {
    const all = await this.getAll();
    return all.filter((p) => p.method === method);
  }

  async getPending(): Promise<Payment[]> {
    return this.getByStatus('pendiente');
  }

  async getByOwner(_ownerId: string): Promise<Payment[]> {
    return this.getAll();
  }

  async getByTenant(_tenantId: string): Promise<Payment[]> {
    return this.getAll();
  }

  async create(payment: Payment): Promise<Payment> {
    return apiPost<Payment>(`${getPrefix()}/payments`, payment);
  }

  async update(id: string, payment: Payment): Promise<Payment> {
    return apiPut<Payment>(`${getPrefix()}/payments/${id}`, payment);
  }

  async delete(id: string): Promise<void> {
    await apiDelete(`${getPrefix()}/payments/${id}`);
  }
}

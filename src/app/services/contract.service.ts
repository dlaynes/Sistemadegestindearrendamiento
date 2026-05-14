import type { Contract } from '../types/contract';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client';
import type { UserRole } from '../types/user';

export interface ContractService {
  getAll(): Promise<Contract[]>;
  getById(id: string | number): Promise<Contract | undefined>;
  getByProperty(propertyId: string | number): Promise<Contract[]>;
  getByStatus(status: string): Promise<Contract[]>;
  getByOwner(ownerId: string | number): Promise<Contract[]>;
  getByTenant(tenantId: string | number): Promise<Contract[]>;
  create(contract: Contract): Promise<Contract>;
  update(id: string | number, contract: Contract): Promise<Contract>;
  delete(id: string | number): Promise<void>;
}

function getRole(): UserRole | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as { role: UserRole }).role;
  } catch {
    return null;
  }
}

function getPrefix(): string {
  const role = getRole();
  if (role === 'administrador') return '/admin';
  if (role === 'arrendador') return '/landlord';
  if (role === 'inquilino') return '/tenant';
  return '/landlord';
}

export class ApiContractService implements ContractService {
  async getAll(): Promise<Contract[]> {
    return apiGet<Contract[]>(`${getPrefix()}/contracts`);
  }

  async getById(id: string | number): Promise<Contract | undefined> {
    try {
      return await apiGet<Contract>(`${getPrefix()}/contracts/${id}`);
    } catch {
      return undefined;
    }
  }

  async getByProperty(propertyId: string | number): Promise<Contract[]> {
    // Admin only; fallback for others
    if (getRole() === 'administrador') {
      return apiGet<Contract[]>(`/admin/contracts/property/${propertyId}`);
    }
    const all = await this.getAll();
    return all.filter((c) => String(c.propertyId) === String(propertyId));
  }

  async getByStatus(status: string): Promise<Contract[]> {
    const all = await this.getAll();
    return all.filter((c) => c.status === status);
  }

  async getByOwner(_ownerId: string | number): Promise<Contract[]> {
    return apiGet<Contract[]>(`${getPrefix()}/contracts`);
  }

  async getByTenant(_tenantId: string | number): Promise<Contract[]> {
    return apiGet<Contract[]>(`${getPrefix()}/contracts`);
  }

  async create(contract: Contract): Promise<Contract> {
    return apiPost<Contract>(`${getPrefix()}/contracts`, contract);
  }

  async update(id: string | number, contract: Contract): Promise<Contract> {
    return apiPut<Contract>(`${getPrefix()}/contracts/${id}`, contract);
  }

  async delete(id: string | number): Promise<void> {
    await apiDelete(`${getPrefix()}/contracts/${id}`);
  }
}

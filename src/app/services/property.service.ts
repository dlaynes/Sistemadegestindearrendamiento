import type { Property } from '../types/property';
import { apiGet, apiPost, apiPut, apiDelete, getStoredRole } from './api-client';

export interface PropertyService {
  getAll(): Promise<Property[]>;
  getById(id: string | number): Promise<Property | undefined>;
  getByOwner(ownerId: string | number): Promise<Property[]>;
  getAvailable(): Promise<Property[]>;
  create(property: Property): Promise<Property>;
  update(id: string | number, property: Property): Promise<Property>;
  delete(id: string | number): Promise<void>;
}

function getPrefix(): string {
  const role = getStoredRole();
  if (role === 'administrador') return '/admin';
  if (role === 'arrendador') return '/landlord';
  return '/landlord';
}

export class ApiPropertyService implements PropertyService {
  async getAll(): Promise<Property[]> {
    return apiGet<Property[]>(`${getPrefix()}/properties`);
  }

  async getById(id: string | number): Promise<Property | undefined> {
    try {
      return await apiGet<Property>(`${getPrefix()}/properties/${id}`);
    } catch {
      return undefined;
    }
  }

  async getByOwner(_ownerId: string | number): Promise<Property[]> {
    return apiGet<Property[]>(`${getPrefix()}/properties`);
  }

  async getAvailable(): Promise<Property[]> {
    const all = await this.getAll();
    return all.filter((p) => p.status === 'disponible');
  }

  async create(property: Property): Promise<Property> {
    return apiPost<Property>(`${getPrefix()}/properties`, property);
  }

  async update(id: string | number, property: Property): Promise<Property> {
    return apiPut<Property>(`${getPrefix()}/properties/${id}`, property);
  }

  async delete(id: string | number): Promise<void> {
    await apiDelete(`${getPrefix()}/properties/${id}`);
  }
}

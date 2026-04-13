export type ContractStatus = 'activo' | 'vencido' | 'cancelado' | 'terminado';

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: ContractStatus;
  terms?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractFormData {
  propertyId: string;
  tenantId: string;
  landlordId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  terms?: string;
  notes?: string;
}

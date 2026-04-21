// Unified Contract Types

export type ContractStatus = 'activo' | 'proximo_vencer' | 'vencido' | 'cancelado' | 'terminado';

export interface Contract {
  id: string | number;
  code: string;
  tenant: string;
  tenantEmail?: string;
  tenantPhone?: string;
  property: string;
  propertyAddress?: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  deposit: string;
  status: ContractStatus;
  paymentDay?: number;
  terms?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// For list views - simplified contract
export interface ContractListItem {
  id: string | number;
  code: string;
  tenant: string;
  property: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  deposit: string;
  status: ContractStatus;
}

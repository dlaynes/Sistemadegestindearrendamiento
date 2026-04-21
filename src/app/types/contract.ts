// Unified Contract Types

export type ContractStatus = 'activo' | 'proximo_vencer' | 'vencido' | 'cancelado' | 'terminado';

export type ContractFormData = {
  propertyId: number;
  tenant: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  duration: number;
  monthlyRent?: string;
  deposit: string;
  contractType: 'fijo' | 'mensual' | 'renovable';
  paymentDay: number;
  terms?: string[];
  includeUtilities: boolean;
  includeMaintenance: boolean;
};

export interface Contract {
  id: string | number;
  code: string;
  tenant: string;
  tenantEmail?: string;
  tenantPhone?: string;
  propertyId?: number;
  property: string;
  propertyAddress?: string;
  startDate: string;
  endDate: string;
  duration?: number;
  monthlyRent?: string;
  contractType?: 'fijo' | 'mensual' | 'renovable';
  deposit: string;
  status: ContractStatus;
  paymentDay?: number;
  terms?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: Attachment[];
}

export type Attachment = {
  id: number;
  name: string;
  size: string;
  type: string;
};

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

// Unified Contract Types

export type ContractStatus = 'activo' | 'proximo_vencer' | 'vencido' | 'cancelado' | 'terminado';

export type ContractFormData = {
  propertyId: number;
  tenantId?: number;
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  invitedTenantName?: string;
  invitedTenantEmail?: string;
  invitedTenantPhone?: string;
  startDate: string;
  endDate: string;
  duration: number;
  monthlyRent: string;
  services?: string;
  deposit: string;
  contractType: 'fijo' | 'mensual' | 'renovable';
  paymentDay: number;
  terms?: string;
  includeUtilities: boolean;
  includeMaintenance: boolean;
};

export interface Contract {
  id: string | number;
  code: string;
  tenantId?: number;
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  landlordId?: number;
  landlordName?: string;
  landlordEmail?: string;
  propertyId?: number;
  property?: string;
  propertyAddress?: string;
  invitedTenantName?: string;
  invitedTenantEmail?: string;
  invitedTenantPhone?: string;
  invitationToken?: string;
  startDate: string;
  endDate: string;
  duration?: number;
  monthlyRent: string;
  services?: string;
  contractType?: 'fijo' | 'mensual' | 'renovable';
  deposit: string;
  status: ContractStatus;
  paymentDay?: number;
  terms?: string;
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
  tenantName?: string;
  property?: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  deposit: string;
  status: ContractStatus;
}

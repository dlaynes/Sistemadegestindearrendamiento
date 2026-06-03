import { apiGet, apiPost } from './api-client';
import type {
  ContractAmendment,
  ContractAmendmentDecisionRequest,
  ContractAmendmentPropose,
} from '../types/contract-amendment';

export interface ContractAmendmentService {
  listByContract(contractId: number | string): Promise<ContractAmendment[]>;
  propose(contractId: number | string, dto: ContractAmendmentPropose): Promise<ContractAmendment>;
  decide(
    contractId: number | string,
    amendmentId: number | string,
    dto: ContractAmendmentDecisionRequest,
  ): Promise<ContractAmendment>;
  withdraw(contractId: number | string, amendmentId: number | string): Promise<ContractAmendment>;
}

function getPrefix(): string {
  // Inherited from the rest of the services: role-prefixed paths.
  // Tenants and landlords both have their own routes; the prefix is decided at the service level.
  // Since the FE uses a single Api* class per domain, this layer just hits the role-aware path
  // by reading localStorage like the other services do.
  // For simplicity in v1, we use the prefix dynamically based on the stored role.
  if (typeof window === 'undefined') return '/landlord';
  try {
    const raw = localStorage.getItem('rentmanager_user');
    if (!raw) return '/landlord';
    const u = JSON.parse(raw) as { role?: string };
    if (u.role === 'inquilino') return '/tenant';
    if (u.role === 'administrador') return '/admin';
  } catch {
    // fall through
  }
  return '/landlord';
}

export class ApiContractAmendmentService implements ContractAmendmentService {
  async listByContract(contractId: number | string): Promise<ContractAmendment[]> {
    return apiGet<ContractAmendment[]>(`${getPrefix()}/contracts/${contractId}/amendments`);
  }

  async propose(contractId: number | string, dto: ContractAmendmentPropose): Promise<ContractAmendment> {
    return apiPost<ContractAmendment>(`${getPrefix()}/contracts/${contractId}/amendments`, dto);
  }

  async decide(
    contractId: number | string,
    amendmentId: number | string,
    dto: ContractAmendmentDecisionRequest,
  ): Promise<ContractAmendment> {
    return apiPost<ContractAmendment>(
      `${getPrefix()}/contracts/${contractId}/amendments/${amendmentId}/decision`,
      dto,
    );
  }

  async withdraw(contractId: number | string, amendmentId: number | string): Promise<ContractAmendment> {
    return apiPost<ContractAmendment>(
      `${getPrefix()}/contracts/${contractId}/amendments/${amendmentId}/withdraw`,
      {},
    );
  }
}

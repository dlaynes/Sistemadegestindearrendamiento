import { ContractWizard } from '../shared/contract-wizard';

export function AdminContractWizard() {
  return (
    <ContractWizard
      mode="administrador"
      title="Nuevo Contrato de Arrendamiento"
      backUrl="/contratos"
    />
  );
}
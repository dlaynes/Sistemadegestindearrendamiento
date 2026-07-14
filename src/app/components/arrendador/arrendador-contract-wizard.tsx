import { ContractWizard } from '../shared/contract-wizard';

export function ArrendadorContractWizard() {
  return (
    <ContractWizard
      mode="arrendador"
      title="Nuevo Contrato de Arrendamiento"
      backUrl="/contratos"
    />
  );
}
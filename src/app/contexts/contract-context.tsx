import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Contract, ContractFormData } from '../types/contract';
import { useProperty } from './property-context';

interface ContractContextType {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  updateContract: (id: string, contract: Contract) => void;
  deleteContract: (id: string) => void;
  getContractById: (id: string) => Contract | undefined;
  getContractsByProperty: (propertyId: string) => Contract[];
  getContractsByStatus: (status: ContractStatus) => Contract[];
  getAvailableContracts: () => Contract[];
}

interface ContractContextProps {
  children: ReactNode;
}

interface PropertyContracts {
  id: string;
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  getContractById: (id: string) => Contract | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: ContractContextProps) {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 'CT-001',
      propertyId: '1',
      tenantId: '3',
      landlordId: '2',
      startDate: '2025-04-01',
      endDate: '2026-04-01',
      monthlyRent: 850,
      deposit: 850,
      status: 'activo',
      terms: 'Contrato de arrendamiento residencial estándar',
      notes: 'Primer contrato del apartamento centro',
      createdAt: '2025-03-15T00:00:00Z',
      updatedAt: '2026-04-12T00:00:00Z',
    },
    {
      id: 'CT-002',
      propertyId: '2',
      tenantId: '4',
      landlordId: '4',
      startDate: '2025-04-01',
      endDate: '2026-04-01',
      monthlyRent: 1200,
      deposit: 1200,
      status: 'activo',
      terms: 'Contrato para casa familiar',
      notes: 'Familia con niños pequeños',
      createdAt: '2025-03-16T00:00:00Z',
      updatedAt: '2026-04-12T00:00:00Z',
    },
    {
      id: 'CT-003',
      propertyId: '3',
      tenantId: '5',
      landlordId: '2',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      monthlyRent: 650,
      deposit: 650,
      status: 'vencido',
      terms: 'Contrato de prueba',
      notes: 'Contrato terminado por falta de pago',
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2025-04-01T00:00:00Z',
    },
  ]);

  const { properties } = useProperty();

  const addContract = useCallback((contract: Contract) => {
    setContracts((prev) => [...prev, contract]);
  }, []);

  const updateContract = useCallback((id: string, contract: Contract) => {
    setContracts((prev) =>
      prev.map((contract) => (contract.id === id ? contract : contract))
    );
  }, []);

  const deleteContract = useCallback((id: string) => {
    setContracts((prev) => prev.filter((contract) => contract.id !== id));
  }, []);

  const getContractById = useCallback((id: string) => {
    return contracts.find((contract) => contract.id === id);
  }, [contracts]);

  const getContractsByProperty = useCallback((propertyId: string) => {
    return contracts.filter((contract) => contract.propertyId === propertyId);
  }, [contracts]);

  const getContractsByStatus = useCallback((status: ContractStatus) => {
    return contracts.filter((contract) => contract.status === status);
  }, [contracts]);

  const getAvailableContracts = useCallback(() => {
    return contracts.filter((contract) => contract.status === 'activo');
  }, [contracts]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        addContract,
        updateContract,
        deleteContract,
        getContractById,
        getContractsByProperty,
        getContractsByStatus,
        getAvailableContracts,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract debe ser usado dentro de un ContractProvider');
  }
  return context;
}
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useServices } from '../services';
import type { Contract, ContractStatus } from '../types';

interface ContractContextType {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  addContract: (contract: Contract) => Promise<Contract>;
  updateContract: (id: string, contract: Contract) => Promise<Contract>;
  deleteContract: (id: string) => Promise<void>;
  getContractById: (id: string) => Contract | undefined;
  getContractsByProperty: (propertyId: string) => Contract[];
  getContractsByStatus: (status: ContractStatus) => Contract[];
  getAvailableContracts: () => Contract[];
  getMyContracts: () => Contract[];
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: ReactNode }) {
  const { contract: contractService } = useServices();
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    contractService
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setContracts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [contractService, user]);

  const addContract = useCallback(
    async (contract: Contract) => {
      const created = await contractService.create(contract);
      setContracts((prev) => [...prev, created]);
      return created;
    },
    [contractService]
  );

  const updateContract = useCallback(
    async (id: string, contract: Contract) => {
      const updated = await contractService.update(id, contract);
      setContracts((prev) =>
        prev.map((c) => (String(c.id) === id ? updated : c))
      );
      return updated;
    },
    [contractService]
  );

  const deleteContract = useCallback(
    async (id: string) => {
      await contractService.delete(id);
      setContracts((prev) => prev.filter((c) => String(c.id) !== id));
    },
    [contractService]
  );

  const getContractById = useCallback(
    (id: string) => {
      return contracts.find((c) => String(c.id) === id);
    },
    [contracts]
  );

  const getContractsByProperty = useCallback(
    (propertyId: string) => {
      return contracts.filter((c) => String(c.propertyId) === propertyId);
    },
    [contracts]
  );

  const getContractsByStatus = useCallback(
    (status: ContractStatus) => {
      return contracts.filter((c) => c.status === status);
    },
    [contracts]
  );

  const getAvailableContracts = useCallback(() => {
    return contracts.filter((c) => c.status === 'activo');
  }, [contracts]);

  const getMyContracts = useCallback(() => {
    if (!user) return [];
    if (user.role === 'administrador') return contracts;
    if (user.role === 'arrendador') {
      // For mock: all contracts for arrendador
      return contracts.filter((_c) => {
        // Try to match by propertyId first, otherwise skip
        return true;
      });
    }
    // inquilino - filter by tenant name
    return contracts.filter((c) => c.tenantName === user.name);
  }, [contracts, user]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        isLoading,
        error,
        addContract,
        updateContract,
        deleteContract,
        getContractById,
        getContractsByProperty,
        getContractsByStatus,
        getAvailableContracts,
        getMyContracts,
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

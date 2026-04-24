import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Contract, ContractStatus } from '../types';

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

const ContractContext = createContext<ContractContextType | undefined>(undefined);

const initialContracts: Contract[] = [
  {
    id: 1,
    code: 'CT-0001',
    tenant: 'Juan Pérez',
    tenantEmail: 'juan.perez@email.com',
    tenantPhone: '+1 (555) 123-4567',
    property: 'Apartamento Centro #101',
    propertyAddress: 'Calle Principal 123, Centro',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    monthlyRent: '$3,200',
    deposit: '$6,400',
    status: 'activo',
    paymentDay: 5,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permiten mascotas sin autorización previa del arrendador.',
      'El arrendatario debe mantener la propiedad en buen estado.',
    ],
    attachments: [
      { id: 1, name: 'Contrato firmado.pdf', size: '2.4 MB', type: 'application/pdf' },
      { id: 2, name: 'Identificación inquilino.pdf', size: '1.1 MB', type: 'application/pdf' },
    ],
  },
  {
    id: 2,
    code: 'CT-0002',
    tenant: 'Ana Martínez',
    tenantEmail: 'ana.martinez@email.com',
    tenantPhone: '+1 (555) 234-5678',
    property: 'Casa Residencial #102',
    propertyAddress: 'Av. Los Pinos 456, Zona Norte',
    startDate: '2025-08-15',
    endDate: '2027-08-15',
    monthlyRent: '$4,500',
    deposit: '$9,000',
    status: 'activo',
    paymentDay: 15,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'Se permite máximo 2 mascotas pequeñas.',
    ],
    attachments: [
      { id: 1, name: 'Contrato firmado.pdf', size: '2.4 MB', type: 'application/pdf' },
      { id: 2, name: 'Identificación inquilino.pdf', size: '1.1 MB', type: 'application/pdf' },
    ],
  },
  {
    id: 3,
    code: 'CT-0003',
    tenant: 'María García',
    tenantEmail: 'maria.garcia@email.com',
    tenantPhone: '+1 (555) 345-6789',
    property: 'Apartamento Vista Mar #103',
    propertyAddress: 'Malecón 789, Playa',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    monthlyRent: '$2,800',
    deposit: '$5,600',
    status: 'proximo_vencer',
    paymentDay: 1,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permiten fiestas o reuniones ruidosas.',
    ],
    attachments: [
      { id: 1, name: 'Contrato firmado.pdf', size: '2.4 MB', type: 'application/pdf' },
      { id: 2, name: 'Identificación inquilino.pdf', size: '1.1 MB', type: 'application/pdf' },
    ],
  },
  {
    id: 4,
    code: 'CT-0004',
    tenant: 'Laura Gómez',
    tenantEmail: 'laura.gomez@email.com',
    tenantPhone: '+1 (555) 456-7890',
    property: 'Casa Familiar #201',
    propertyAddress: 'Residencial Las Flores 555',
    startDate: '2024-12-01',
    endDate: '2026-12-01',
    monthlyRent: '$5,500',
    deposit: '$11,000',
    status: 'activo',
    paymentDay: 10,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'Se permite jardinería y mascotas grandes.',
    ],
    attachments: [
      { id: 1, name: 'Contrato firmado.pdf', size: '2.4 MB', type: 'application/pdf' },
    ],
  },
  {
    id: 5,
    code: 'CT-0005',
    tenant: 'Roberto Silva',
    tenantEmail: 'roberto.silva@email.com',
    tenantPhone: '+1 (555) 567-8901',
    property: 'Estudio Moderno #104',
    propertyAddress: 'Calle Comercial 321, Centro',
    startDate: '2025-01-15',
    endDate: '2025-12-15',
    monthlyRent: '$2,200',
    deposit: '$4,400',
    status: 'proximo_vencer',
    paymentDay: 20,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permite subarriendo.',
    ],
    attachments: [
      { id: 1, name: 'Contrato firmado.pdf', size: '2.4 MB', type: 'application/pdf' },
    ],
  },
];

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);

  const addContract = useCallback((contract: Contract) => {
    setContracts((prev) => [...prev, { ...contract, id: contract.id || prev.length + 1 }]);
  }, []);

  const updateContract = useCallback((id: string, contract: Contract) => {
    setContracts((prev) =>
      prev.map((c) => (String(c.id) === id ? { ...contract, id: c.id } : c))
    );
  }, []);

  const deleteContract = useCallback((id: string) => {
    setContracts((prev) => prev.filter((c) => String(c.id) !== id));
  }, []);

  const getContractById = useCallback((id: string) => {
    return contracts.find((c) => String(c.id) === id);
  }, [contracts]);

  const getContractsByProperty = useCallback((propertyId: string) => {
    return contracts.filter((c) => String(c.propertyId) === propertyId);
  }, [contracts]);

  const getContractsByStatus = useCallback((status: ContractStatus) => {
    return contracts.filter((c) => c.status === status);
  }, [contracts]);

  const getAvailableContracts = useCallback(() => {
    return contracts.filter((c) => c.status === 'activo');
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

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { 
  FileText, 
  User,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Edit,
  Trash2,
  Download,
  FileDown,
  Upload
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useServices } from '../../services';
import { 
  BackButton, 
  StatusBadge, 
  InfoCard, 
  SidebarActions, 
  DocumentList,
  EmptyState,
  getDaysUntilExpiration
} from '../shared';
import type { Document as Doc } from '../shared/detail/document-list';
import { useContract } from '../../contexts/contract-context';
import type { Payment } from '../../types';

export function AdminContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { payment: paymentService, document: documentService } = useServices();
  
  const { getContractById } = useContract();
  const contract = id ? getContractById(id) : undefined;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [documents, setDocuments] = useState<Doc[]>([]);

  useEffect(() => {
    if (!contract?.id) return;
    let cancelled = false;
    setIsLoadingPayments(true);
    paymentService
      .getByContract(contract.id)
      .then((data) => {
        if (!cancelled) setPayments(data);
      })
      .catch(() => {
        if (!cancelled) setPayments([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPayments(false);
      });
    return () => { cancelled = true; };
  }, [contract?.id, paymentService]);

  useEffect(() => {
    if (!contract?.id) return;
    let cancelled = false;
    documentService
      .getDocuments('CONTRACT', contract.id)
      .then((data) => {
        if (!cancelled) {
          setDocuments(
            data.map((d) => ({
              id: d.id,
              name: d.name,
              size: d.size < 1024 ? `${d.size} B` : d.size < 1024 * 1024 ? `${(d.size / 1024).toFixed(1)} KB` : `${(d.size / (1024 * 1024)).toFixed(1)} MB`,
              type: d.contentType,
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) setDocuments([]);
      });
    return () => { cancelled = true; };
  }, [contract?.id, documentService]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contract?.id) return;
    try {
      await documentService.uploadDocument('CONTRACT', contract.id, file);
      const data = await documentService.getDocuments('CONTRACT', contract.id);
      setDocuments(
        data.map((d) => ({
          id: d.id,
          name: d.name,
          size: d.size < 1024 ? `${d.size} B` : d.size < 1024 * 1024 ? `${(d.size / 1024).toFixed(1)} KB` : `${(d.size / (1024 * 1024)).toFixed(1)} MB`,
          type: d.contentType,
        }))
      );
    } catch (err) {
      alert('Error al subir el archivo: ' + (err instanceof Error ? err.message : 'desconocido'));
    }
  };

  const handleDownload = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.downloadDocument(doc.id!);
    } catch (err) {
      console.error('Error descargando:', err);
    }
  };

  const handleDelete = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.deleteDocument(doc.id!);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id!));
    } catch (err) {
      alert('Error al eliminar el archivo');
    }
  };

  if (!contract) {
    return (
      <EmptyState
        icon={FileText}
        title="Contrato no encontrado"
        description="El contrato que buscas no existe"
        action={{
          label: "Volver a Contratos",
          onClick: () => navigate('/contratos')
        }}
      />
    );
  }

  const daysLeft = getDaysUntilExpiration(contract.endDate, new Date('2026-03-27'));
  const isExpiringSoon = daysLeft <= 90;

  const contractInfoItems = [
    { label: 'Código', value: contract.code, icon: FileText },
    { label: 'Inicio', value: contract.startDate, icon: Calendar },
    { label: 'Finalización', value: contract.endDate, icon: Calendar },
    { label: 'Renta Mensual', value: contract.monthlyRent, icon: DollarSign },
    { label: 'Depósito', value: contract.deposit, icon: DollarSign },
    { label: 'Día de Pago', value: `${contract.paymentDay} de cada mes`, icon: Clock },
  ];

  const tenantInfoItems = [
    { label: 'Nombre', value: contract.invitedTenantName, icon: User },
    { label: 'Email', value: contract.invitedTenantEmail, icon: Mail },
    { label: 'Teléfono', value: contract.invitedTenantPhone, icon: Phone },
  ];

  const propertyInfoItems = [
    { label: 'Propiedad', value: contract.property, icon: Building2 },
    { label: 'Dirección', value: contract.propertyAddress, icon: Building2 },
  ];

  const toMonthName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('es', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/contratos')} label="Volver a contratos" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{contract.code}</h1>
            <p className="text-gray-600">{contract.property}</p>
          </div>
          <StatusBadge status={contract.status} type="contract" size="lg" />
        </div>
      </div>

      {isExpiringSoon && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            El contrato vence en {daysLeft} días - Considera renovar o buscar nuevo inquilino
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            title="Información del Contrato"
            icon={FileText}
            items={contractInfoItems}
          />

          <InfoCard
            title="Información del Inquilino"
            icon={User}
            items={tenantInfoItems}
          />

          <InfoCard
            title="Propiedad"
            icon={Building2}
            items={propertyInfoItems}
          />

          <InfoCard
            title="Términos y Condiciones"
            icon={FileText}
            columns={1}
            items={[]}
          >
            <div className="whitespace-pre-wrap text-gray-900">{contract.terms}</div>
          </InfoCard>

          <InfoCard
            title="Historial de Pagos"
            icon={DollarSign}
            columns={1}
            items={[]}
          >
            {isLoadingPayments ? (
              <p className="text-sm text-gray-500">Cargando pagos...</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-gray-500">No hay pagos registrados.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {payment.status === 'pagado' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{toMonthName(payment.dueDate)}</p>
                        <p className="text-sm text-gray-600">{payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{payment.amount}</p>
                      <StatusBadge status={payment.status} type="payment" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </InfoCard>

          <DocumentList
            title="Documentos del Contrato"
            documents={documents}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
              <Upload className="w-4 h-4" />
              <span>Subir documento</span>
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
            <p className="text-xs text-gray-500 mt-1">Máx. 4MB. Imágenes, PDF, Word, Excel o TXT.</p>
          </div>
        </div>

        <div className="space-y-6">
          <SidebarActions
            title="Acciones"
            actions={[
              { 
                label: 'Editar Contrato', 
                icon: Edit, 
                onClick: () => navigate(`/contratos/${contract.id}/editar`), 
                variant: 'primary' 
              },
              { 
                label: 'Renovar', 
                icon: Calendar, 
                onClick: () => console.log('Renovar'), 
                variant: 'secondary' 
              },
              { 
                label: 'Descargar PDF', 
                icon: FileDown, 
                onClick: () => console.log('Download'), 
                variant: 'secondary' 
              },
              { 
                label: 'Eliminar', 
                icon: Trash2, 
                onClick: () => console.log('Eliminar'), 
                variant: 'danger' 
              },
            ]}
          />

          <SidebarActions
            title="Documentos"
            actions={[
              { 
                label: 'Descargar Contrato', 
                icon: Download, 
                onClick: () => console.log('Descargar'), 
                variant: 'secondary' 
              },
              { 
                label: 'Ver Facturas', 
                icon: FileText, 
                onClick: () => console.log('Facturas'), 
                variant: 'secondary' 
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

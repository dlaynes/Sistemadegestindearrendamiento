import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { ProposeAmendmentDialog, AmendmentTimeline, AmendmentDecisionDialog } from '../shared/amendments';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/auth-context';
import type { ContractAmendment } from '../../types/contract-amendment';
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
import { Spinner } from '../shared/ui/spinner';
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

export function ArrendadorContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { payment: paymentService, document: documentService } = useServices();
  
  const { getContractById, deleteContract } = useContract();
  const contract = id ? getContractById(id) : undefined;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteContract = async () => {
    if (!contract) return;
    setIsDeleting(true);
    try {
      await deleteContract(String(contract.id));
      toast.success('Contrato eliminado');
      navigate('/contratos');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar el contrato');
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [decisionTarget, setDecisionTarget] = useState<ContractAmendment | null>(null);
  const [decisionKind, setDecisionKind] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Doc[]>([]);

  useEffect(() => {
    if (!contract?.id) {
      setIsLoadingPayments(false);
      return;
    }
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
    if (!contract?.id) {
      setDocuments([]);
      return;
    }
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
      toast.error('Error al subir el archivo: ' + (err instanceof Error ? err.message : 'desconocido'));
    }
  };

  const handleDownload = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.downloadDocument(doc.id!);
    } catch {
      console.error('Error descargando documento');
    }
  };

  const handleDelete = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.deleteDocument(doc.id!);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id!));
    } catch {
      toast.error('Error al eliminar el archivo');
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

  const daysLeft = getDaysUntilExpiration(contract.endDate, new Date());
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

      <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">{contract.code}</h1>
            <p className="text-muted-foreground">{contract.property}</p>
          </div>
          <StatusBadge status={contract.status} type="contract" size="lg" />
        </div>
      </div>

      {isExpiringSoon && (
        <div className="bg-warning-muted border border-warning rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-warning" />
          <span className="text-sm text-warning-muted-foreground">
            El contrato vence en {daysLeft} días - Considera renovar o buscar nuevo inquilino
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

        <section className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs xl:col-span-2">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-h2 font-semibold text-foreground">Historial de enmiendas</h2>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => setProposeOpen(true)}
            >
              Proponer cambio
            </Button>
          </header>
          <AmendmentTimeline
            contractId={contract.id}
            currentUserId={user?.id != null ? Number(user.id) : undefined}
            currentUserRole={user?.role}
            onApprove={(a) => {
              setDecisionTarget(a);
              setDecisionKind('APPROVED');
            }}
            onReject={(a) => {
              setDecisionTarget(a);
              setDecisionKind('REJECTED');
            }}
          />
        </section>
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
            columns={1} items={[]}          >
            <div className="whitespace-pre-wrap text-foreground">{contract.terms}</div>
          </InfoCard>

          <InfoCard
            title="Historial de Pagos"
            icon={DollarSign}
            columns={1} items={[]}          >
            {isLoadingPayments ? (
              <div className="flex items-center justify-center py-4" aria-live="polite">
                <Spinner size="sm" label="Cargando pagos" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay pagos registrados.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {payment.status === 'pagado' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{toMonthName(payment.dueDate)}</p>
                        <p className="text-sm text-muted-foreground">{payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{payment.amount}</p>
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

          <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-4">
            <label className="flex items-center gap-2 text-primary hover:text-primary-muted-foreground cursor-pointer font-medium">
              <Upload className="w-4 h-4" />
              <span>Subir documento</span>
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
            <p className="text-xs text-muted-foreground mt-1">Máx. 4MB. Imágenes, PDF, Word, Excel o TXT.</p>
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
                label: 'Proponer cambio', 
                icon: Calendar, 
                onClick: () => setProposeOpen(true), 
                variant: 'primary' 
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
                onClick: () => setIsDeleteOpen(true),
                variant: 'danger',
                disabled: isDeleting,
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
      <ProposeAmendmentDialog
        contractId={contract.id}
        open={proposeOpen}
        onOpenChange={setProposeOpen}
      />
      <AmendmentDecisionDialog
        contractId={contract.id}
        amendment={decisionTarget}
        decision={decisionKind}
        open={decisionTarget != null}
        onOpenChange={(o) => !o && setDecisionTarget(null)}
      />
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contrato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el contrato
              <span className="font-semibold"> {contract.code} </span>
              y todos sus pagos y documentos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteContract();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando…' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

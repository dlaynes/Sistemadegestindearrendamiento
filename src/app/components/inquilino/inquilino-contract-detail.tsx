import { useState, useEffect } from 'react';
import { AmendmentTimeline, AmendmentDecisionDialog, ProposeAmendmentDialog } from '../shared/amendments';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/auth-context';
import type { ContractAmendment } from '../../types/contract-amendment';
import { useParams } from 'react-router';
import { FileText, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Spinner } from '../shared/ui/spinner';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useServices } from '../../services';
import { BackButton, StatusBadge, InfoCard, SidebarActions, DocumentList, EmptyState } from '../shared';
import type { Document as Doc } from '../shared/detail/document-list';
import { useContract } from '../../contexts/contract-context';
import type { Payment } from '../../types';

export function InquilinoContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { payment: paymentService, document: documentService } = useServices();

  const { getContractById } = useContract();
  const contract = id ? getContractById(id) : undefined;

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

  const handleDownload = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.downloadDocument(doc.id!);
    } catch (err) {
      console.error('Error descargando:', err);
    }
  };

  if (!contract) {
    return (
      <EmptyState
        icon={FileText}
        title="Contrato no encontrado"
        description="El contrato que buscas no existe"
        action={{
          label: 'Volver a Contratos',
          onClick: () => navigate('/contratos'),
        }}
      />
    );
  }

  const contractInfoItems = [
    { label: 'Código', value: contract.code },
    { label: 'Inicio', value: contract.startDate },
    { label: 'Finalización', value: contract.endDate },
    { label: 'Renta Mensual', value: contract.monthlyRent },
    { label: 'Depósito', value: contract.deposit },
  ];

  const propertyInfoItems = [
    { label: 'Propiedad', value: contract.property },
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
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Mi Contrato</h1>
            <p className="text-muted-foreground">{contract.property}</p>
          </div>
          <Button type="button" onClick={() => setProposeOpen(true)}>
            Proponer cambio
          </Button>
          <StatusBadge status={contract.status} type="contract" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            title="Información del Contrato"
            icon={FileText}
            items={contractInfoItems}
          />

          <InfoCard
            title="Propiedad"
            icon={FileText}
            items={propertyInfoItems}
          />

          <InfoCard title="Términos y Condiciones" icon={FileText} columns={1} items={[]}>
            <div className="whitespace-pre-wrap text-foreground">{contract.terms}</div>
          </InfoCard>

          <InfoCard title="Historial de Pagos" icon={FileText} columns={1} items={[]}>
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
          />
        </div>

        <div className="space-y-6">
          <SidebarActions
            title="Acciones"
            actions={[
              {
                label: 'Descargar Contrato',
                icon: FileText,
                onClick: () => console.log('Descargar'),
                variant: 'primary',
              },
              {
                label: 'Contactar Arrendador',
                icon: MessageSquare,
                onClick: () => navigate('/mensajes'),
                variant: 'secondary',
              },
            ]}
          />
        </div>

        <section className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs">
          <header className="mb-4">
            <h2 className="text-h2 font-semibold text-foreground">Historial de enmiendas</h2>
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
      </div>
      <AmendmentDecisionDialog
        contractId={contract.id}
        amendment={decisionTarget}
        decision={decisionKind}
        open={decisionTarget != null}
        onOpenChange={(o) => !o && setDecisionTarget(null)}
      />
      <ProposeAmendmentDialog
        contractId={contract.id}
        open={proposeOpen}
        onOpenChange={setProposeOpen}
      />
    </div>
  );
}

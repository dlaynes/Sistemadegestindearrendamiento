import { Search } from 'lucide-react';
import { useAutocomplete } from '../../../hooks/use-autocomplete';
import type { UseFormRegister } from 'react-hook-form';
import type { User } from '../../../types';
import type { ContractFormData } from '../../../types/contract';

interface WizardStepTenantProps {
  users: User[];
  selectedTenantId?: number;
  invitedTenantName?: string;
  invitedTenantEmail?: string;
  invitedTenantPhone?: string;
  onSelectTenant: (user: User) => void;
  onClearTenant: () => void;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  register: UseFormRegister<ContractFormData>;
  errors: Partial<Record<string, { message?: string }>>;
  disabled?: boolean;
}

export function WizardStepTenant({
  users,
  selectedTenantId,
  invitedTenantName,
  invitedTenantEmail,
  invitedTenantPhone,
  onSelectTenant,
  onClearTenant,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  register,
  errors,
  disabled,
}: WizardStepTenantProps) {
  const selectedUser = users.find((u) => String(u.id) === String(selectedTenantId));

  const autocomplete = useAutocomplete<User>({
    items: users,
    filter: (item, query) =>
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query),
    getDisplay: (item) => item.name,
    onSelect: onSelectTenant,
    initialQuery: selectedUser?.name || invitedTenantName || '',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Información del Inquilino</h3>
        <p className="text-muted-foreground mb-4">
          Busca un inquilino existente o ingresa los datos manualmente para enviar una invitación.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-foreground mb-2">Inquilino</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={autocomplete.query}
                disabled={disabled || !!selectedUser}
                onChange={(e) => {
                  const value = e.target.value;
                  autocomplete.setQuery(value);
                  autocomplete.setIsOpen(true);
                  autocomplete.setHighlighted(0);
                  onChangeName(value);
                  if (value.trim() === '') {
                    onClearTenant();
                  }
                }}
                onFocus={() => autocomplete.setIsOpen(true)}
                onKeyDown={autocomplete.handleKeyDown}
                placeholder="Buscar inquilino por nombre o correo..."
                className="w-full pl-10 pr-28 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
              />
              {selectedUser && (
                <button
                  type="button"
                  onClick={() => {
                    autocomplete.reset();
                    onClearTenant();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary-hover font-medium"
                >
                  Cambiar inquilino
                </button>
              )}
            </div>

            {autocomplete.isOpen && !selectedUser && (
              <div
                ref={autocomplete.listRef}
                className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
              >
                {autocomplete.filteredItems.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No se encontraron inquilinos</div>
                ) : (
                  autocomplete.filteredItems.map((user, index) => (
                    <button
                      key={user.id}
                      type="button"
                      data-index={index}
                      onClick={() => autocomplete.handleSelect(user)}
                      onMouseEnter={() => autocomplete.setHighlighted(index)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        index === autocomplete.highlighted ? 'bg-primary-muted' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Nombre completo *</label>
            <input
              type="text"
              value={invitedTenantName || ''}
              disabled={disabled || !!selectedUser}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Ej: María García"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            />
            <input type="hidden" {...register('invitedTenantName', { required: !selectedUser })} />
            {errors.invitedTenantName?.message && (
              <p className="mt-1 text-sm text-destructive">{errors.invitedTenantName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Correo electrónico *</label>
            <input
              type="email"
              value={invitedTenantEmail || ''}
              disabled={disabled || !!selectedUser}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="Ej: maria@email.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            />
            <input type="hidden" {...register('invitedTenantEmail', { required: !selectedUser })} />
            {errors.invitedTenantEmail?.message && (
              <p className="mt-1 text-sm text-destructive">{errors.invitedTenantEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Teléfono *</label>
            <input
              type="tel"
              value={invitedTenantPhone || ''}
              disabled={disabled || !!selectedUser}
              onChange={(e) => onChangePhone(e.target.value)}
              placeholder="Ej: 987654321"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            />
            <input type="hidden" {...register('invitedTenantPhone', { required: !selectedUser })} />
            {errors.invitedTenantPhone?.message && (
              <p className="mt-1 text-sm text-destructive">{errors.invitedTenantPhone.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
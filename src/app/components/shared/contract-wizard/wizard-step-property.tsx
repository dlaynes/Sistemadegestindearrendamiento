import { Building2, Search, ChevronDown } from 'lucide-react';
import { useAutocomplete } from '../../../hooks/use-autocomplete';
import type { UseFormRegister } from 'react-hook-form';
import type { Property } from '../../../types';
import type { ContractFormData } from '../../../types/contract';

interface WizardStepPropertyProps {
  properties: Property[];
  selectedPropertyId?: number;
  onSelect: (property: Property) => void;
  register: UseFormRegister<ContractFormData>;
  error?: string;
}

export function WizardStepProperty({
  properties,
  selectedPropertyId,
  onSelect,
  register,
  error,
}: WizardStepPropertyProps) {
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  const autocomplete = useAutocomplete<Property>({
    items: properties,
    filter: (item, query) =>
      item.name.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query),
    getDisplay: (item) => item.name,
    onSelect,
    initialQuery: selectedProperty?.name || '',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Selecciona la Propiedad</h3>
        <p className="text-muted-foreground mb-4">
          Elige la propiedad que será objeto del contrato de arrendamiento
        </p>

        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={autocomplete.query}
              onChange={(e) => {
                autocomplete.setQuery(e.target.value);
                autocomplete.setIsOpen(true);
                autocomplete.setHighlighted(0);
              }}
              onFocus={() => autocomplete.setIsOpen(true)}
              onKeyDown={autocomplete.handleKeyDown}
              placeholder="Buscar propiedad por nombre o dirección..."
              className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => autocomplete.setIsOpen(!autocomplete.isOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-muted-foreground"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {autocomplete.isOpen && (
            <div
              ref={autocomplete.listRef}
              className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {autocomplete.filteredItems.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">No se encontraron propiedades</div>
              ) : (
                autocomplete.filteredItems.map((property, index) => (
                  <button
                    key={property.id}
                    type="button"
                    data-index={index}
                    onClick={() => autocomplete.handleSelect(property)}
                    onMouseEnter={() => autocomplete.setHighlighted(index)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      index === autocomplete.highlighted ? 'bg-primary-muted' : 'hover:bg-muted'
                    } ${
                      selectedPropertyId === property.id
                        ? 'border-l-4 border-primary'
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{property.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {property.address} - ${property.rent}/mes
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedProperty && (
          <div className="mt-4 p-4 border-2 border-primary bg-primary-muted rounded-lg flex items-center gap-4">
            <Building2 className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <div className="font-medium text-foreground">{selectedProperty.name}</div>
              <div className="text-sm text-muted-foreground">{selectedProperty.address}</div>
              <div className="text-sm font-semibold text-primary mt-1">${selectedProperty.rent}/mes</div>
            </div>
          </div>
        )}

        <input type="hidden" {...register('propertyId', { required: 'Debes seleccionar una propiedad' })} />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
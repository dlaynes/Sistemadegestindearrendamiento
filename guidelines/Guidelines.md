# Sistema de Gestión de Arrendamiento - Guidelines

This document provides guidelines for working with this rental management system codebase.

---

## Project Architecture

### Tech Stack
- **Framework**: React 18 + Vite 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Routing**: React Router v7
- **UI Components**: Radix UI primitives + custom shadcn-style components
- **State Management**: React Context API
- **Backend**: Supabase

### Folder Structure
```
src/
├── app/
│   ├── components/
│   │   ├── ui/           # Reusable UI primitives (Card, Button, Dialog, etc.)
│   │   ├── shared/       # SHARED atomic components (see below)
│   │   ├── admin/        # Admin role-specific components
│   │   ├── arrendador/   # Landlord role-specific components
│   │   ├── inquilino/    # Tenant role-specific components
│   │   ├── login.tsx
│   │   ├── welcome.tsx
│   │   └── layout.tsx
│   ├── contexts/         # React contexts (auth, property, contract, payment)
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   ├── router.tsx        # Route configuration
│   └── App.tsx
└── styles/
    ├── tailwind.css      # Tailwind v4 imports
    ├── theme.css         # Design tokens & CSS variables
    ├── fonts.css
    └── index.css
```

---

## Shared Components Architecture

The `/src/app/components/shared/` directory contains atomic, reusable components that can be used across all role-specific pages. **DO NOT** create wrapper pages - use these atomic components directly in each role's pages.

### Directory Structure

```
src/app/components/shared/
├── ui/                   # Atomic UI components
│   ├── status-badge.tsx
│   ├── back-button.tsx
│   ├── empty-state.tsx
│   ├── summary-cards.tsx
│   └── action-button.tsx
├── dashboard/            # Dashboard-specific components
│   ├── stats-card.tsx
│   ├── page-header.tsx
│   └── activity-item.tsx
├── forms/                # Form components
│   ├── form-field.tsx
│   ├── form-section.tsx
│   ├── tag-input.tsx
│   └── form-actions.tsx
├── detail/               # Detail view components
│   ├── info-card.tsx
│   ├── sidebar-actions.tsx
│   └── document-list.tsx
├── lists/                # List view components
│   ├── filter-buttons.tsx
│   ├── search-filter.tsx
│   ├── property-card.tsx
│   └── contract-card.tsx
├── messages/             # Messaging components
│   └── messages-interface.tsx
├── utils/                # Utility functions
│   ├── date-utils.ts
│   └── status-utils.ts
└── index.ts              # Barrel export
```

---

## Shared Component Usage Guidelines

### 1. UI Components

#### StatusBadge
Use for displaying status indicators throughout the app.

```tsx
import { StatusBadge } from '../shared';

// Contract status
<StatusBadge status="activo" type="contract" />

// Payment status
<StatusBadge status="pagado" type="payment" size="lg" />

// Property status
<StatusBadge status="ocupado" type="property" />
```

#### BackButton
Use for navigation back buttons in detail views.

```tsx
import { BackButton } from '../shared';

<BackButton onClick={() => navigate(-1)} label="Volver" />
```

#### EmptyState
Use for empty list states.

```tsx
import { EmptyState } from '../shared';
import { Building2 } from 'lucide-react';

<EmptyState
  icon={Building2}
  title="No hay propiedades"
  description="Comienza agregando una nueva propiedad"
  action={{ label: "Agregar Propiedad", onClick: handleAdd }}
/>
```

#### ActionButton
Use for consistent button styling.

```tsx
import { ActionButton } from '../shared';
import { Plus, Trash2 } from 'lucide-react';

<ActionButton variant="primary" icon={Plus} onClick={handleAdd}>
  Agregar
</ActionButton>

<ActionButton variant="danger" icon={Trash2} size="sm">
  Eliminar
</ActionButton>
```

---

### 2. Dashboard Components

#### StatsCard
Use for dashboard statistic cards.

```tsx
import { StatsCard } from '../shared';
import { Building2 } from 'lucide-react';

<StatsCard
  label="Total Propiedades"
  value="24"
  icon={Building2}
  color="bg-blue-500"
  change="+3 este mes"
/>
```

#### PageHeader
Use for consistent page headers.

```tsx
import { PageHeader } from '../shared';

<PageHeader
  title="Dashboard - Administrador"
  subtitle="Vista general del sistema de gestión"
/>

<PageHeader
  title="Propiedades"
  subtitle="Gestiona tus propiedades"
  action={<ActionButton>Agregar</ActionButton>}
/>
```

#### ActivityItem
Use for activity/notification lists.

```tsx
import { ActivityItem } from '../shared';

<ActivityItem
  type="Nuevo contrato"
  description="Contrato firmado para Propiedad #5"
  time="Hace 2 horas"
  status="success"
/>
```

---

### 3. Form Components

#### FormField
Use for wrapping form inputs with labels and error handling.

```tsx
import { FormField } from '../shared';

<FormField
  label="Nombre"
  required
  error={errors.name?.message}
  helpText="Nombre completo del propietario"
>
  <input {...register('name')} className="w-full px-3 py-2 border rounded-lg" />
</FormField>
```

#### FormSection
Use for grouping form fields into sections.

```tsx
import { FormSection } from '../shared';

<FormSection title="Información Básica" columns={2}>
  <FormField label="Nombre">...</FormField>
  <FormField label="Email">...</FormField>
</FormSection>
```

#### TagInput
Use for managing multiple tags/amenities.

```tsx
import { TagInput } from '../shared';

const [amenities, setAmenities] = useState(['Piscina', 'Gimnasio']);

<TagInput
  label="Amenidades"
  tags={amenities}
  onTagsChange={setAmenities}
  placeholder="Agregar amenidad..."
/>
```

#### FormActions
Use for consistent form action buttons.

```tsx
import { FormActions } from '../shared';

<FormActions
  onCancel={() => navigate(-1)}
  submitLabel={isEditing ? "Guardar Cambios" : "Crear Propiedad"}
  isEditing={isEditing}
  showDelete={isEditing}
  onDelete={handleDelete}
/>
```

---

### 4. Detail View Components

#### InfoCard
Use for displaying information sections in detail views.

```tsx
import { InfoCard } from '../shared';
import { FileText, User, Building2 } from 'lucide-react';

<InfoCard
  title="Información del Contrato"
  icon={FileText}
  columns={2}
  items={[
    { label: 'Inquilino', value: 'Juan Pérez', icon: User },
    { label: 'Propiedad', value: 'Apartamento #101', icon: Building2 },
    { label: 'Inicio', value: '2025-06-01' },
    { label: 'Renta', value: '$3,200' },
  ]}
/>
```

#### SidebarActions
Use for action buttons in detail view sidebars.

```tsx
import { SidebarActions } from '../shared';
import { Edit, Trash2, Download } from 'lucide-react';

<SidebarActions
  title="Acciones"
  actions={[
    { label: 'Editar', icon: Edit, onClick: handleEdit, variant: 'primary' },
    { label: 'Descargar PDF', icon: Download, onClick: handleDownload },
    { label: 'Eliminar', icon: Trash2, onClick: handleDelete, variant: 'danger' },
  ]}
/>
```

#### DocumentList
Use for displaying document lists in detail views.

```tsx
import { DocumentList } from '../shared';

<DocumentList
  title="Documentos"
  documents={[
    { name: 'Contrato.pdf', size: '2.5 MB', type: 'pdf' },
    { name: 'Recibo.pdf', size: '1.2 MB', type: 'pdf' },
  ]}
  onView={handleView}
  onDownload={handleDownload}
/>
```

---

### 5. List View Components

#### FilterButtons
Use for filter button groups in lists.

```tsx
import { FilterButtons } from '../shared';

const [filter, setFilter] = useState('all');

<FilterButtons
  options={[
    { value: 'all', label: 'Todos' },
    { value: 'activo', label: 'Activos' },
    { value: 'proximo_vencer', label: 'Próximos' },
  ]}
  activeValue={filter}
  onChange={setFilter}
/>
```

#### SearchFilter
Use for search and filter inputs in lists.

```tsx
import { SearchFilter } from '../shared';

<SearchFilter
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Buscar propiedades..."
  selectValue={statusFilter}
  onSelectChange={setStatusFilter}
  selectOptions={[
    { value: 'all', label: 'Todos' },
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'disponible', label: 'Disponible' },
  ]}
  selectPlaceholder="Filtrar por estado"
/>
```

#### PropertyCard
Use for property list items.

```tsx
import { PropertyCard } from '../shared';

<PropertyCard
  property={{
    id: 1,
    name: 'Apartamento Centro',
    address: 'Calle Principal 123',
    status: 'ocupado',
    rent: '$1,200',
    bedrooms: 2,
    bathrooms: 1,
    area: '75 m²',
    tenant: 'Juan Pérez',
  }}
  onView={handleView}
/>
```

#### ContractCard
Use for contract list items.

```tsx
import { ContractCard } from '../shared';

<ContractCard
  contract={{
    id: 1,
    tenant: 'Juan Pérez',
    property: 'Apartamento Centro',
    status: 'activo',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    monthlyRent: '$3,200',
    deposit: '$6,400',
  }}
  onView={handleView}
  onEdit={handleEdit}
  showActions
/>
```

---

### 6. Messages Components

#### MessagesInterface
Use for the messaging/chat interface.

```tsx
import { MessagesInterface } from '../shared';

<MessagesInterface
  role="arrendador"  // or "inquilino"
  conversations={conversations}
  messages={messages}
  selectedConversationId={selectedId}
  onSelectConversation={setSelected}
  newMessage={newMessage}
  onNewMessageChange={setNewMessage}
  onSendMessage={handleSend}
  searchValue={search}
  onSearchChange={setSearch}
/>
```

---

### 7. Utility Functions

#### Date Utilities

```tsx
import {
  getDaysUntilExpiration,
  getDaysOverdue,
  formatDate,
  formatShortDate,
  formatTimeAgo,
} from '../shared';

// Days until contract expires
const daysLeft = getDaysUntilExpiration('2026-06-01');

// Days payment is overdue
const overdueDays = getDaysOverdue('2026-03-27');

// Format dates
const formatted = formatDate('2026-03-27');  // "27 de marzo de 2026"
const short = formatShortDate('2026-03-27'); // "Mar 27, 2026"
const ago = formatTimeAgo('2026-03-27 10:30'); // "Hace 2 horas"
```

#### Status Utilities

```tsx
import {
  getContractStatusColor,
  getContractStatusLabel,
  getPaymentStatusColor,
  getPropertyStatusColor,
  isActiveStatus,
} from '../shared';

// Get status colors
const colorClass = getContractStatusColor('activo'); // "bg-green-100 text-green-700"
const label = getContractStatusLabel('activo');       // "Activo"

// Check if status is active
const isActive = isActiveStatus('pagado'); // true
```

---

## General Guidelines

### Component Development
- Use functional components with TypeScript interfaces for props
- Place reusable UI primitives in `/src/app/components/ui/`
- Place **atomic shared components** in `/src/app/components/shared/`
- Use the `cn()` utility from `ui/utils.ts` for conditional class merging
- Follow the naming convention: `[role]-[feature].tsx` for role-specific components
- Keep components under 400 lines; extract complex logic into hooks or utilities

### Using Shared Components
1. **Import from the shared barrel:** `import { ComponentName } from '../shared';`
2. **Use directly in role pages** - do not create wrapper pages
3. **Pass role-specific data as props** rather than duplicating logic
4. **Customize with props** like `variant`, `size`, `className`

### TypeScript Patterns
- Define types in `/src/app/types/` with descriptive names
- Export shared component types from their index files
- Use strict typing; avoid `any`
- Prefer interface over type for object shapes

### Routing
- Routes are defined in `/src/app/router.tsx`
- Role-based routes are grouped under `/[role]/` paths
- Use `ProtectedRoute` component for authentication/authorization guards
- Route parameters follow REST conventions: `:id` for IDs, `:id/edit` for editing

---

## Design System Guidelines

### Colors & Theming
- Use CSS variables defined in `/src/styles/theme.css`
- Primary color: `#030213` (dark navy)
- Destructive color: `#d4183d` (red for errors)
- Muted backgrounds: `#ececf0` or `#f3f3f5`
- Text muted: `#717182`
- Always use semantic color variables (e.g., `bg-primary`, `text-foreground`)

### Typography
- Base font size: 16px (defined in `:root`)
- Headings use `font-weight: 500` (medium)
- Body text uses `font-weight: 400` (normal)
- Use the typography scale from `theme.css` (h1-h4, label, button, input)

### Spacing & Layout
- Prefer `gap` utilities over margin for spacing between elements
- Use `px-6` as standard horizontal padding for cards/containers
- Border radius: `rounded-xl` (default: 0.625rem) for cards, `rounded-lg` for buttons
- Card components have consistent internal padding: `px-6 pt-6 pb-6`

---

## Role-Based Development

### User Roles
1. **Administrador** (Admin): Full system access, user management, reports
2. **Arrendador** (Landlord): Property management, contracts, payment tracking
3. **Inquilino** (Tenant): View properties, contracts, make payments

### Component Organization
- Each role has its own folder: `/src/app/components/[role]/`
- Shared layout components are in the parent `components/` folder
- Atomic shared components are in `/src/app/components/shared/`
- Role-specific features should use shared components rather than duplicating code

### Permission Patterns
- Check authentication in `ProtectedRoute` before rendering role routes
- Role-specific routes use `allowedRoles` prop on `ProtectedRoute`
- UI elements that require permissions should be conditionally rendered based on user role

---

## State Management

### Context Usage
- `AuthContext`: User authentication state and methods
- `PropertyContext`: Property listings and CRUD operations
- `ContractContext`: Rental contracts management
- `PaymentContext`: Payment records and processing

### Data Fetching Patterns
- Fetch data in context providers or page components
- Use loading states with consistent loading UI (spinner in center)
- Handle errors gracefully with user-friendly messages

---

## Best Practices

### Performance
- Use React.memo for expensive renders in lists
- Lazy load route components if bundle size becomes an issue
- Optimize images and assets

### Accessibility
- Use semantic HTML elements
- Ensure proper focus management in modals and dialogs
- Use Radix UI components for accessible primitives (already implemented)

### Code Style
- Use single quotes for strings
- Trailing commas in multi-line objects/arrays
- 2-space indentation
- Import order: React, third-party, internal (alphabetized within groups)

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | `kebab-case.tsx` | `admin-dashboard.tsx` |
| Types | `feature.ts` | `property.ts` |
| Contexts | `[feature]-context.tsx` | `auth-context.tsx` |
| Hooks | `use[Feature].ts` | `useAuth.ts` |
| Utils | `camelCase.ts` | `formatDate.ts` |
| Shared Components | `kebab-case.tsx` | `status-badge.tsx` |

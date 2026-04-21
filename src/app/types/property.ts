// Unified Property Types

export type PropertyStatus = 'disponible' | 'ocupado' | 'mantenimiento';

export type PropertyType = 
  | 'apartamento' 
  | 'casa' 
  | 'estudio' 
  | 'loft' 
  | 'penthouse' 
  | 'villa' 
  | 'otro';

export interface Property {
  id: string | number;
  name: string;
  address: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: string;
  rent: string;
  status: PropertyStatus;
  description: string;
  yearBuilt: number;
  floors: number;
  furnished: boolean;
  amenities: string[];
  tenant?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// For list views - simplified property
export interface PropertyListItem {
  id: string | number;
  name: string;
  address: string;
  status: PropertyStatus;
  rent: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  tenant?: string;
}

export type PropertyStatus = 'disponible' | 'ocupado' | 'mantenimiento' | 'vender';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: number;
  status: PropertyStatus;
  description: string;
  yearBuilt: number;
  floors: number;
  furnished: boolean;
  amenities: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFormData {
  name: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: number;
  status: PropertyStatus;
  description: string;
  yearBuilt: number;
  floors: number;
  furnished: boolean;
  amenities?: string[];
}

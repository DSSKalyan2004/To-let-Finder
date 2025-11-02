export enum UserType {
  Tenant = 'TENANT',
  Owner = 'OWNER',
}

export interface User {
  uid: string;
  name: string;
  email: string;
  type: UserType;
  phone?: string;
  password?: string; // Only used for mock authentication
}

export type PropertyType = 'Apartment' | 'Villa' | 'Studio' | 'Cottage' | 'Penthouse' | 'Room';
export const propertyTypes: PropertyType[] = ['Apartment', 'Villa', 'Studio', 'Cottage', 'Penthouse', 'Room'];


export interface House {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  address: string;
  rent: number;
  imageUrls: string[];
  ownerId: string; // UID of the owner
  coordinates: {
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  type: PropertyType;
  createdAt: string; // ISO string date
}

export type View = 'home' | 'login' | 'details' | 'add-house' | 'profile';
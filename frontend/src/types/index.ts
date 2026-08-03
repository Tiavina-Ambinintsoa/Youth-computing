import type { User } from './auth';

export interface Categorie {
  id: number;
  documentId: string;
  nom: string;
  couleur: string;
}

export interface Quartier {
  id: number;
  documentId: string;
  nom: string;
  population?: number;
}

export interface Signalement {
  id: number;
  documentId: string;
  titre: string;
  description: string;
  latitude: number;
  longitude: number;
  adresse?: string;
  statut: 'en_attente' | 'en_cours' | 'resolu';
  score_priorite: number;
  categorie?: Categorie;
  quartier?: Quartier;
  photos?: Photo[];
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: number;
  url: string;
  name: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}
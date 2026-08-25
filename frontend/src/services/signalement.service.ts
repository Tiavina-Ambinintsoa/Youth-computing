// frontend/src/services/signalement.service.ts
import { api } from '@/lib/axios';
import type { Signalement, StrapiResponse, Photo } from '@/types';

export interface SignalementFilters {
  statut?: 'en_attente' | 'en_cours' | 'resolu';
  categorieId?: number;
  quartierId?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateSignalementPayload {
  titre: string;
  description: string;
  latitude: number;
  longitude: number;
  adresse?: string;
  categorie?: string;
  quartier?: string;
  photos?: number[];
}

export interface UpdateSignalementPayload {
  statut?: 'en_attente' | 'en_cours' | 'resolu';
  score_priorite?: number;
  titre?: string;
  description?: string;
}

export const signalementService = {
  async findAll(filters?: SignalementFilters): Promise<StrapiResponse<Signalement[]>> {
    const params = new URLSearchParams();

    if (filters?.statut) {
      params.append('filters[statut][$eq]', filters.statut);
    }
    if (filters?.categorieId) {
      params.append('filters[categorie][id][$eq]', String(filters.categorieId));
    }
    if (filters?.quartierId) {
      params.append('filters[quartier][id][$eq]', String(filters.quartierId));
    }

    params.append('populate', '*');
    params.append('pagination[page]', String(filters?.page ?? 1));
    params.append('pagination[pageSize]', String(filters?.pageSize ?? 25));

    const { data } = await api.get<StrapiResponse<Signalement[]>>(
      `/api/signalements?${params.toString()}`
    );
    return data;
  },

  async findMine(_userId: number): Promise<StrapiResponse<Signalement[]>> {
    const { data } = await api.get<StrapiResponse<Signalement[]>>('/api/signalements/me');
    return data;
  },

  async findOne(documentId: string): Promise<Signalement> {
    const { data } = await api.get<StrapiResponse<Signalement>>(
      `/api/signalements/${documentId}?populate[0]=categorie&populate[1]=quartier&populate[2]=photos&populate[3]=user`
    );
    return data.data;
  },

  async create(payload: CreateSignalementPayload): Promise<Signalement> {
    const body: any = {
      titre: payload.titre,
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude,
      adresse: payload.adresse,
      photos: payload.photos,
    };
    if (payload.categorie) {
      body.categorie = payload.categorie;
    }
    if (payload.quartier) {
      body.quartier = payload.quartier;
    }
    const { data } = await api.post<StrapiResponse<Signalement>>(
      '/api/signalements',
      { data: body }
    );
    return data.data;
  },

  async update(documentId: string, payload: UpdateSignalementPayload): Promise<Signalement> {
    const { data } = await api.put<StrapiResponse<Signalement>>(
      `/api/signalements/${documentId}`,
      { data: payload }
    );
    return data.data;
  },

  async delete(documentId: string): Promise<void> {
    await api.delete(`/api/signalements/${documentId}`);
  },

  async uploadPhoto(file: File): Promise<Photo[]> {
    const formData = new FormData();
    formData.append('files', file);
    const { data } = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

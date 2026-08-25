// frontend/src/services/categorie.service.ts
import { api } from '@/lib/axios';
import type { Categorie, StrapiResponse } from '@/types';

export const categorieService = {
  async findAll(): Promise<Categorie[]> {
    const { data } = await api.get<StrapiResponse<Categorie[]>>('/api/categories');
    return data.data;
  },

  async findOne(documentId: string): Promise<Categorie> {
    const { data } = await api.get<StrapiResponse<Categorie>>(
      `/api/categories/${documentId}`
    );
    return data.data;
  },
};
// frontend/src/services/quartier.service.ts
import { api } from '@/lib/axios';
import type { Quartier, StrapiResponse } from '@/types';

export const quartierService = {
  async findAll(): Promise<Quartier[]> {
    const { data } = await api.get<StrapiResponse<Quartier[]>>('/api/quartiers');
    return data.data;
  },

  async findOne(documentId: string): Promise<Quartier> {
    const { data } = await api.get<StrapiResponse<Quartier>>(
      `/api/quartiers/${documentId}`
    );
    return data.data;
  },
};
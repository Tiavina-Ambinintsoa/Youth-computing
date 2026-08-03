// frontend/src/hooks/useSignalements.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { signalementService } from '@/services/signalement.service';
import type { SignalementFilters, CreateSignalementPayload, UpdateSignalementPayload } from '@/services/signalement.service';
import { useAuth } from '@/contexts/AuthContext';

export const SIGNALEMENT_KEYS = {
  all: ['signalements'] as const,
  lists: () => [...SIGNALEMENT_KEYS.all, 'list'] as const,
  list: (filters?: SignalementFilters) => [...SIGNALEMENT_KEYS.lists(), filters] as const,
  detail: (id: string) => [...SIGNALEMENT_KEYS.all, 'detail', id] as const,
};

export function useSignalements(filters?: SignalementFilters) {
  return useQuery({
    queryKey: SIGNALEMENT_KEYS.list(filters),
    queryFn: () => signalementService.findAll(filters),
  });
}

export function useMySignalements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...SIGNALEMENT_KEYS.all, 'mine', user?.id],
    queryFn: () => signalementService.findMine(user!.id),
    enabled: !!user?.id,
  });
}

export function useSignalement(documentId: string) {
  return useQuery({
    queryKey: SIGNALEMENT_KEYS.detail(documentId),
    queryFn: () => signalementService.findOne(documentId),
    enabled: !!documentId,
  });
}

export function useCreateSignalement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSignalementPayload) =>
      signalementService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNALEMENT_KEYS.lists() });
      toast.success('Signalement créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du signalement');
    },
  });
}

export function useUpdateSignalement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, payload }: { documentId: string; payload: UpdateSignalementPayload }) =>
      signalementService.update(documentId, payload),
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: SIGNALEMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SIGNALEMENT_KEYS.detail(documentId) });
      toast.success('Statut mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });
}

export function useDeleteSignalement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => signalementService.delete(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNALEMENT_KEYS.lists() });
      toast.success('Signalement supprimé');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });
}
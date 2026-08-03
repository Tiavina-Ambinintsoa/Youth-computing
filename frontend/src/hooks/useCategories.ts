// frontend/src/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { categorieService } from '@/services/categorie.service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categorieService.findAll(),
    staleTime: 1000 * 60 * 10, // 10 min, les catégories changent peu
  });
}
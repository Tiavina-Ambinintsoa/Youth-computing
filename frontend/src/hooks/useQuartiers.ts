import { useQuery } from "@tanstack/react-query";
import { quartierService } from "@/services/quartier.service";

export function useQuartiers() {
    return useQuery({
        queryKey: ['quartiers'],
        queryFn: () => quartierService.findAll(),
        staleTime: 1000 * 60 * 10,
    })
}
import { useQuery } from '@tanstack/react-query'
import { mapaApi } from '@/modules/mapa/api/mapaApi'

export function useEstadoUnidades() {
  return useQuery({
    queryKey: ['mapa', 'estado-unidades'],
    queryFn: () => mapaApi.listarEstadoUnidades(),
    select: (r) => r.data,
    refetchInterval: 30_000,
  })
}

export function usePingsPorUnidad(unidadId: string | null) {
  return useQuery({
    queryKey: ['mapa', 'pings', unidadId],
    queryFn: () => mapaApi.pingsPorUnidad(unidadId!),
    select: (r) => r.data,
    enabled: !!unidadId,
  })
}

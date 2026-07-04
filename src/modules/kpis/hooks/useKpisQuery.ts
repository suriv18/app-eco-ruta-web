import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/queryKeys'
import { kpisApi } from '@/modules/kpis/api/kpisApi'

export function useResumenDiario(params: { distritoId: string; fecha: string } | null) {
  return useQuery({
    queryKey: queryKeys.kpis.resumenDiario(params ?? undefined),
    queryFn: () => kpisApi.getResumenDiario(params!),
    select: (r) => r.data,
    enabled: !!params?.distritoId && !!params?.fecha,
  })
}

export function useCalcularResumen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { distritoId: string; fecha: string }) =>
      kpisApi.calcularResumenDiario(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.kpis.resumenDiario() }),
  })
}

export function useKpisRutas(params?: { fechaDesde?: string; fechaHasta?: string; page?: number }) {
  return useQuery({
    queryKey: queryKeys.kpis.rutas(params),
    queryFn: () => kpisApi.getRutas({ ...params, size: 20 }),
    select: (r) => r.data,
  })
}

export function useKpisUnidades(params?: { unidadId?: string; fechaDesde?: string; fechaHasta?: string; page?: number }) {
  return useQuery({
    queryKey: queryKeys.kpis.unidades(params),
    queryFn: () => kpisApi.getUnidades({ ...params, size: 20 }),
    select: (r) => r.data,
  })
}

export function useKpisZonas(params?: { zonaId?: string; fechaDesde?: string; fechaHasta?: string; page?: number }) {
  return useQuery({
    queryKey: queryKeys.kpis.zonas(params),
    queryFn: () => kpisApi.getZonas({ ...params, size: 20 }),
    select: (r) => r.data,
  })
}

export function useKpisAlertas(params?: { zonaId?: string; fechaDesde?: string; fechaHasta?: string; page?: number }) {
  return useQuery({
    queryKey: queryKeys.kpis.alertas(params),
    queryFn: () => kpisApi.getAlertas({ ...params, size: 20 }),
    select: (r) => r.data,
  })
}

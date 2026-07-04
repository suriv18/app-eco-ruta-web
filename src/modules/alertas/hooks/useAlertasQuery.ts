import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/queryKeys'
import { alertasApi } from '@/modules/alertas/api/alertasApi'
import type { EstadoAlerta, CambiarEstadoAlertaRequest, AgregarFotoAlertaRequest, ValidarAlertaRequest } from '@/modules/alertas/types/alertasTypes'

export function useAlertas(params?: { estado?: EstadoAlerta; page?: number; size?: number }) {
  return useQuery({
    queryKey: queryKeys.alertas.list(params),
    queryFn: () => alertasApi.listar(params),
    select: (r) => r.data,
  })
}

export function useAlertasCriticas(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: queryKeys.alertas.criticas(params),
    queryFn: () => alertasApi.listarCriticas(params),
    select: (r) => r.data,
  })
}

export function useAlerta(id: string) {
  return useQuery({
    queryKey: queryKeys.alertas.detail(id),
    queryFn: () => alertasApi.obtener(id),
    select: (r) => r.data,
    enabled: !!id,
  })
}

export function useCambiarEstadoAlerta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CambiarEstadoAlertaRequest }) =>
      alertasApi.cambiarEstado(id, data),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.alertas.all() })
      qc.invalidateQueries({ queryKey: queryKeys.alertas.detail(id) })
    },
  })
}

export function useValidarAlerta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ValidarAlertaRequest }) =>
      alertasApi.validar(id, data),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.alertas.all() })
      qc.invalidateQueries({ queryKey: queryKeys.alertas.detail(id) })
    },
  })
}

export function useAgregarFotoAlerta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AgregarFotoAlertaRequest }) =>
      alertasApi.agregarFoto(id, data),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.alertas.detail(id) })
    },
  })
}

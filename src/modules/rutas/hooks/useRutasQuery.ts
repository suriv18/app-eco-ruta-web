import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/queryKeys'
import { rutasApi } from '@/modules/rutas/api/rutasApi'
import type {
  EstadoRuta,
  ActualizarParadaRequest,
  RegistrarEventoRutaRequest,
} from '@/modules/rutas/types/rutasTypes'

export function useRutas(params?: { distritoId?: string; fecha?: string; estado?: EstadoRuta; page?: number; size?: number }) {
  return useQuery({
    queryKey: queryKeys.rutas.list(params),
    queryFn: () => rutasApi.listar(params),
    select: (r) => r.data,
  })
}

export function useRuta(id: string) {
  return useQuery({
    queryKey: queryKeys.rutas.detail(id),
    queryFn: () => rutasApi.obtener(id),
    select: (r) => r.data,
    enabled: !!id,
  })
}

export function useRutaDetalle(id: string) {
  return useQuery({
    queryKey: [...queryKeys.rutas.detail(id), 'detalle'],
    queryFn: () => rutasApi.obtenerDetalle(id),
    select: (r) => r.data,
    enabled: !!id,
  })
}

export function useCrearRuta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: rutasApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.rutas.all() }),
  })
}

type AccionRuta = 'aprobar' | 'iniciar-ejecucion' | 'finalizar' | 'cancelar'

export function useAccionRuta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, accion }: { id: string; accion: AccionRuta }) => {
      if (accion === 'aprobar') return rutasApi.aprobar(id)
      if (accion === 'iniciar-ejecucion') return rutasApi.iniciarEjecucion(id)
      if (accion === 'finalizar') return rutasApi.finalizar(id)
      return rutasApi.cancelar(id)
    },
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.rutas.all() })
      qc.invalidateQueries({ queryKey: queryKeys.rutas.detail(id) })
    },
  })
}

export function useActualizarParada() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ rutaId, paradaId, data }: { rutaId: string; paradaId: string; data: ActualizarParadaRequest }) =>
      rutasApi.actualizarParada(rutaId, paradaId, data),
    onSuccess: (_res, { rutaId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.rutas.detail(rutaId) })
    },
  })
}

export function useRegistrarEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ rutaId, data }: { rutaId: string; data: RegistrarEventoRutaRequest }) =>
      rutasApi.registrarEvento(rutaId, data),
    onSuccess: (_res, { rutaId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.rutas.detail(rutaId) })
    },
  })
}

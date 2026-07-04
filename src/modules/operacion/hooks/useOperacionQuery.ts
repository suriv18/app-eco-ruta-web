import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/queryKeys'
import {
  distritosApi, zonasApi, depositosApi, contenedoresApi,
  unidadesApi, choferesApi, turnosApi, horariosApi,
} from '@/modules/operacion/api/operacionApi'
import type { EstadoContenedor, EstadoOperativoUnidad, EstadoChofer } from '@/modules/operacion/types/operacionTypes'

// ── Distritos ───────────────────────────────────────────────────────────────
export function useDistritos(page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.distritos.list({ page, size }),
    queryFn: () => distritosApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearDistrito() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: distritosApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.distritos.all() }),
  })
}

export function useToggleDistrito() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      activo ? distritosApi.desactivar(id) : distritosApi.activar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.distritos.all() }),
  })
}

// ── Zonas ────────────────────────────────────────────────────────────────────
export function useZonas(page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.zonas.list({ page, size }),
    queryFn: () => zonasApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearZona() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: zonasApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.zonas.all() }),
  })
}

export function useDesactivarZona() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => zonasApi.desactivar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.zonas.all() }),
  })
}

// ── Depósitos ─────────────────────────────────────────────────────────────────
export function useDepositos(page = 0, size = 20) {
  return useQuery({
    queryKey: ['depositos', 'list', { page, size }],
    queryFn: () => depositosApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearDeposito() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: depositosApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['depositos'] }),
  })
}

// ── Contenedores ──────────────────────────────────────────────────────────────
export function useContenedores(page = 0, size = 20) {
  return useQuery({
    queryKey: ['contenedores', 'list', { page, size }],
    queryFn: () => contenedoresApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearContenedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: contenedoresApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contenedores'] }),
  })
}

export function useCambiarEstadoContenedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: string; nuevoEstado: EstadoContenedor }) =>
      contenedoresApi.cambiarEstado(id, nuevoEstado),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contenedores'] }),
  })
}

// ── Unidades ──────────────────────────────────────────────────────────────────
export function useUnidades(page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.unidades.list({ page, size }),
    queryFn: () => unidadesApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearUnidad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: unidadesApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.unidades.all() }),
  })
}

export function useCambiarEstadoUnidad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: string; nuevoEstado: EstadoOperativoUnidad }) =>
      unidadesApi.cambiarEstado(id, nuevoEstado),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.unidades.all() }),
  })
}

// ── Choferes ──────────────────────────────────────────────────────────────────
export function useChoferes(page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.choferes.list({ page, size }),
    queryFn: () => choferesApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearChofer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: choferesApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.choferes.all() }),
  })
}

export function useCambiarEstadoChofer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoChofer }) =>
      choferesApi.cambiarEstado(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.choferes.all() }),
  })
}

// ── Turnos ────────────────────────────────────────────────────────────────────
export function useTurnos(page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.turnos.list({ page, size }),
    queryFn: () => turnosApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearTurno() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: turnosApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.turnos.all() }),
  })
}

export function useAccionTurno() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, accion }: { id: string; accion: 'iniciar' | 'finalizar' | 'cancelar' }) => {
      if (accion === 'iniciar') return turnosApi.iniciar(id)
      if (accion === 'finalizar') return turnosApi.finalizar(id)
      return turnosApi.cancelar(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.turnos.all() }),
  })
}

// ── Horarios ──────────────────────────────────────────────────────────────────
export function useHorarios(page = 0, size = 20) {
  return useQuery({
    queryKey: ['horarios', 'list', { page, size }],
    queryFn: () => horariosApi.listar({ page, size }),
    select: (r) => r.data,
  })
}

export function useCrearHorario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: horariosApi.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horarios'] }),
  })
}

export function useEliminarHorario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => horariosApi.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horarios'] }),
  })
}

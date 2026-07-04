import { useQuery } from '@tanstack/react-query'
import { alertasApi } from '@/modules/alertas/api/alertasApi'
import { rutasApi } from '@/modules/rutas/api/rutasApi'
import { turnosApi } from '@/modules/operacion/api/operacionApi'
import { mapaApi } from '@/modules/mapa/api/mapaApi'

function hoy() {
  return new Date().toISOString().slice(0, 10)
}

export function useAlertasCriticasDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'alertas-criticas'],
    queryFn: () => alertasApi.listarCriticas({ page: 0, size: 5 }),
    select: (r) => r.data,
    refetchInterval: 60_000,
  })
}

export function useAlertasRecientesDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'alertas-recientes'],
    queryFn: () => alertasApi.listar({ page: 0, size: 5 }),
    select: (r) => r.data,
    refetchInterval: 60_000,
  })
}

export function useRutasHoy() {
  return useQuery({
    queryKey: ['dashboard', 'rutas-hoy'],
    queryFn: () => rutasApi.listar({ fecha: hoy(), page: 0, size: 50 }),
    select: (r) => r.data,
    refetchInterval: 30_000,
  })
}

export function useTurnosActivosDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'turnos'],
    queryFn: () => turnosApi.listar({ page: 0, size: 50 }),
    select: (r) => r.data,
    refetchInterval: 30_000,
  })
}

export function useFlotaDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'flota'],
    queryFn: () => mapaApi.listarEstadoUnidades(),
    select: (r) => r.data,
    refetchInterval: 15_000,
  })
}

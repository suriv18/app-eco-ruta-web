import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'
import type {
  DistritoResponseDto, CrearDistritoRequest,
  ZonaResponseDto, CrearZonaRequest, ActualizarZonaRequest,
  DepositoResponseDto, CrearDepositoRequest,
  ContenedorResponseDto, CrearContenedorRequest, EstadoContenedor,
  UnidadResponseDto, CrearUnidadRequest, EstadoOperativoUnidad,
  ChoferResponseDto, CrearChoferRequest, EstadoChofer,
  TurnoResponseDto, CrearTurnoRequest,
  HorarioResponseDto, CrearHorarioRequest, ActualizarHorarioRequest,
} from '@/modules/operacion/types/operacionTypes'

const BASE = '/api/v1/operacion'

// ── Distritos ───────────────────────────────────────────────────────────────
export const distritosApi = {
  crear: (data: CrearDistritoRequest) =>
    httpClient.post<ApiResponse<DistritoResponseDto>>(`${BASE}/distritos`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<DistritoResponseDto>>>(`${BASE}/distritos`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<DistritoResponseDto>>(`${BASE}/distritos/${id}`).then(r => r.data),
  activar: (id: string) =>
    httpClient.patch(`${BASE}/distritos/${id}/activar`),
  desactivar: (id: string) =>
    httpClient.patch(`${BASE}/distritos/${id}/desactivar`),
}

// ── Zonas ────────────────────────────────────────────────────────────────────
export const zonasApi = {
  crear: (data: CrearZonaRequest) =>
    httpClient.post<ApiResponse<ZonaResponseDto>>(`${BASE}/zonas`, data).then(r => r.data),
  actualizar: (id: string, data: ActualizarZonaRequest) =>
    httpClient.put<ApiResponse<ZonaResponseDto>>(`${BASE}/zonas/${id}`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<ZonaResponseDto>>>(`${BASE}/zonas`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<ZonaResponseDto>>(`${BASE}/zonas/${id}`).then(r => r.data),
  desactivar: (id: string) =>
    httpClient.patch(`${BASE}/zonas/${id}/desactivar`),
}

// ── Depósitos ─────────────────────────────────────────────────────────────────
export const depositosApi = {
  crear: (data: CrearDepositoRequest) =>
    httpClient.post<ApiResponse<DepositoResponseDto>>(`${BASE}/depositos`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<DepositoResponseDto>>>(`${BASE}/depositos`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<DepositoResponseDto>>(`${BASE}/depositos/${id}`).then(r => r.data),
  desactivar: (id: string) =>
    httpClient.patch(`${BASE}/depositos/${id}/desactivar`),
}

// ── Contenedores ──────────────────────────────────────────────────────────────
export const contenedoresApi = {
  crear: (data: CrearContenedorRequest) =>
    httpClient.post<ApiResponse<ContenedorResponseDto>>(`${BASE}/contenedores`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<ContenedorResponseDto>>>(`${BASE}/contenedores`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<ContenedorResponseDto>>(`${BASE}/contenedores/${id}`).then(r => r.data),
  cambiarEstado: (id: string, nuevoEstado: EstadoContenedor) =>
    httpClient.patch(`${BASE}/contenedores/${id}/estado`, { nuevoEstado }),
}

// ── Unidades ──────────────────────────────────────────────────────────────────
export const unidadesApi = {
  crear: (data: CrearUnidadRequest) =>
    httpClient.post<ApiResponse<UnidadResponseDto>>(`${BASE}/unidades`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<UnidadResponseDto>>>(`${BASE}/unidades`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<UnidadResponseDto>>(`${BASE}/unidades/${id}`).then(r => r.data),
  cambiarEstado: (id: string, nuevoEstado: EstadoOperativoUnidad) =>
    httpClient.patch(`${BASE}/unidades/${id}/estado`, { nuevoEstado }),
}

// ── Choferes ──────────────────────────────────────────────────────────────────
export const choferesApi = {
  crear: (data: CrearChoferRequest) =>
    httpClient.post<ApiResponse<ChoferResponseDto>>(`${BASE}/choferes`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<ChoferResponseDto>>>(`${BASE}/choferes`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<ChoferResponseDto>>(`${BASE}/choferes/${id}`).then(r => r.data),
  cambiarEstado: (id: string, estado: EstadoChofer) =>
    httpClient.patch<ApiResponse<ChoferResponseDto>>(`${BASE}/choferes/${id}/estado`, { estado }).then(r => r.data),
}

// ── Turnos ────────────────────────────────────────────────────────────────────
export const turnosApi = {
  crear: (data: CrearTurnoRequest) =>
    httpClient.post<ApiResponse<TurnoResponseDto>>(`${BASE}/turnos`, data).then(r => r.data),
  listar: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<TurnoResponseDto>>>(`${BASE}/turnos`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<TurnoResponseDto>>(`${BASE}/turnos/${id}`).then(r => r.data),
  iniciar: (id: string) =>
    httpClient.patch(`${BASE}/turnos/${id}/iniciar`),
  finalizar: (id: string) =>
    httpClient.patch(`${BASE}/turnos/${id}/finalizar`),
  cancelar: (id: string) =>
    httpClient.patch(`${BASE}/turnos/${id}/cancelar`),
}

// ── Horarios de recolección ───────────────────────────────────────────────────
export const horariosApi = {
  crear: (data: CrearHorarioRequest) =>
    httpClient.post<ApiResponse<HorarioResponseDto>>(`${BASE}/horarios-recoleccion`, data).then(r => r.data),
  actualizar: (id: string, data: ActualizarHorarioRequest) =>
    httpClient.put<ApiResponse<HorarioResponseDto>>(`${BASE}/horarios-recoleccion/${id}`, data).then(r => r.data),
  eliminar: (id: string) =>
    httpClient.delete(`${BASE}/horarios-recoleccion/${id}`),
  listar: (params?: { zonaId?: string; page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PageResult<HorarioResponseDto>>>(`${BASE}/horarios-recoleccion`, { params }).then(r => r.data),
  obtener: (id: string) =>
    httpClient.get<ApiResponse<HorarioResponseDto>>(`${BASE}/horarios-recoleccion/${id}`).then(r => r.data),
}

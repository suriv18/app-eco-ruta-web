import { z } from 'zod'

export const crearRutaSchema = z.object({
  turnoId: z.string().uuid('Selecciona un turno'),
  distritoId: z.string().uuid('Selecciona un distrito'),
  depositoOrigenId: z.string().uuid('Selecciona depósito de origen'),
  depositoDestinoId: z.string().uuid('Selecciona depósito de destino'),
  fecha: z.string().min(1, 'Selecciona una fecha'),
  tipoRuta: z.enum(['HISTORICA', 'OPTIMIZADA', 'REOPTIMIZADA']),
})

export const actualizarParadaSchema = z.object({
  nuevoEstado: z.enum(['PENDIENTE', 'EN_ATENCION', 'ATENDIDA', 'OMITIDA']),
  horaLlegada: z.string().optional(),
  horaSalida: z.string().optional(),
})

export const registrarEventoSchema = z.object({
  tipoEvento: z.enum(['INICIO', 'FIN', 'DESVIO', 'PARADA_ATENDIDA', 'AVERIA', 'REOPTIMIZACION', 'OBSERVACION']),
  descripcion: z.string().max(500).optional().or(z.literal('')),
})

export type CrearRutaFormData = z.infer<typeof crearRutaSchema>
export type ActualizarParadaFormData = z.infer<typeof actualizarParadaSchema>
export type RegistrarEventoFormData = z.infer<typeof registrarEventoSchema>

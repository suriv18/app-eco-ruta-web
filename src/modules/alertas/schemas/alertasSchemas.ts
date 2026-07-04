import { z } from 'zod'

export const cambiarEstadoSchema = z.object({
  nuevoEstado: z.enum(['VALIDADA', 'EN_ATENCION', 'ATENDIDA', 'DESCARTADA', 'DUPLICADA']),
  comentario: z.string().max(500).optional().or(z.literal('')),
})

export const validarAlertaSchema = z.object({
  esDuplicada: z.boolean(),
  alertaOriginalId: z.string().uuid().optional().or(z.literal('')),
  dentroGeocerca: z.boolean(),
  scoreSpam: z.number().min(0).max(1),
  resultado: z.string().min(1, 'Requerido').max(100),
})

export const agregarFotoSchema = z.object({
  urlArchivo: z.string().url('URL inválida').max(500),
  tipoMime: z.string().min(1, 'Requerido').max(50),
  tamanioBytes: z.number().positive().optional(),
})

export type CambiarEstadoFormData = z.infer<typeof cambiarEstadoSchema>
export type ValidarAlertaFormData = z.infer<typeof validarAlertaSchema>
export type AgregarFotoFormData = z.infer<typeof agregarFotoSchema>

import { z } from 'zod'
import { VOLUMENES, CRITICIDADES } from '@/modules/ciudadano/types/ciudadanoTypes'

export const registrarAlertaSchema = z.object({
  distritoExternoId: z.string().min(1, 'Selecciona un distrito'),
  zonaExternoId: z.string().optional(),
  titulo: z.string().min(5, 'Mínimo 5 caracteres').max(150, 'Máximo 150 caracteres'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
  latitud: z.number(),
  longitud: z.number(),
  volumenEstimado: z.enum(VOLUMENES, 'Selecciona el volumen estimado'),
  nivelCriticidad: z.enum(CRITICIDADES, 'Selecciona el nivel de criticidad'),
  fuente: z.string().optional(),
})

export type RegistrarAlertaFormData = z.infer<typeof registrarAlertaSchema>

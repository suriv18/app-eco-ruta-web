import { z } from 'zod'

const PLACA_REGEX = /^[A-Z]{3}-\d{3}$|^[A-Z]\d{4}[A-Z]$/

export const distritoSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  ubigeo: z.string().max(10).optional().or(z.literal('')),
})

export const zonaSchema = z.object({
  distritoId: z.string().uuid('Selecciona un distrito'),
  codigo: z.string().min(2, 'Mínimo 2 caracteres').max(50).regex(/^[A-Z0-9_-]+$/, 'Solo mayúsculas, números, guión y guión bajo'),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  tipoZona: z.enum(['RESIDENCIAL', 'COMERCIAL', 'MIXTA', 'MERCADO', 'INDUSTRIAL', 'OTRA']),
  prioridad: z.number().int().min(1, 'Mínimo 1').max(5, 'Máximo 5'),
})

export const depositoSchema = z.object({
  distritoId: z.string().uuid('Selecciona un distrito'),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  tipo: z.enum(['BASE', 'TRANSFERENCIA', 'RELLENO', 'OTRO']),
})

export const contenedorSchema = z.object({
  zonaId: z.string().uuid('Selecciona una zona'),
  codigo: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  capacidadM3: z.number().positive('Debe ser mayor a 0'),
})

export const unidadSchema = z.object({
  placa: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PLACA_REGEX, 'Formato: ABC-123 o A1234B'),
  codigoInterno: z.string().min(1, 'Requerido').max(50),
  tipoUnidad: z.enum(['COMPACTADOR', 'BARANDA', 'VOLQUETE', 'MOTOFURGON', 'OTRO']),
  capacidadM3: z.number().positive('Debe ser mayor a 0'),
  capacidadKg: z.number().positive('Debe ser mayor a 0'),
})

export const choferSchema = z.object({
  nombres: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  apellidos: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números').optional().or(z.literal('')),
  licencia: z.string().min(3, 'Mínimo 3 caracteres').max(20).optional().or(z.literal('')),
  telefono: z.string().min(7, 'Mínimo 7 dígitos').max(15).optional().or(z.literal('')),
})

export const turnoSchema = z
  .object({
    unidadId: z.string().uuid('Selecciona una unidad'),
    choferId: z.string().uuid('Selecciona un chofer'),
    distritoId: z.string().uuid('Selecciona un distrito'),
    fecha: z.string().min(1, 'Requerida'),
    horaInicio: z.string().min(1, 'Requerida'),
    horaFin: z.string().min(1, 'Requerida'),
    tipoTurno: z.enum(['MANANA', 'TARDE', 'NOCHE']),
  })
  .refine((d) => d.horaFin > d.horaInicio, {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['horaFin'],
  })

export const horarioSchema = z.object({
  zonaId: z.string().uuid('Selecciona una zona'),
  diaSemana: z.number().int().min(1).max(7),
  horaInicio: z.string().min(1, 'Requerida'),
  horaFin: z.string().min(1, 'Requerida'),
  observacion: z.string().max(300).optional().or(z.literal('')),
})

export type DistritoFormData = z.infer<typeof distritoSchema>
export type ZonaFormData = z.infer<typeof zonaSchema>
export type DepositoFormData = z.infer<typeof depositoSchema>
export type ContenedorFormData = z.infer<typeof contenedorSchema>
export type UnidadFormData = z.infer<typeof unidadSchema>
export type ChoferFormData = z.infer<typeof choferSchema>
export type TurnoFormData = z.infer<typeof turnoSchema>
export type HorarioFormData = z.infer<typeof horarioSchema>

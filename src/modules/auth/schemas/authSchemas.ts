import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(1, 'Contraseña requerida'),
  tenantId: z.string().uuid('ID de municipalidad inválido'),
})

export type LoginFormData = z.infer<typeof loginSchema>

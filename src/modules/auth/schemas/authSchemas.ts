import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(1, 'Contraseña requerida'),
  // guid en vez de uuid: el backend (java.util.UUID) acepta cualquier forma
  // 8-4-4-4-12; uuid() de zod 4 exige variante RFC 4122 y rechaza los
  // tenant IDs seed como 11111111-1111-1111-1111-111111111111
  tenantId: z.guid('ID de municipalidad inválido'),
})

export type LoginFormData = z.infer<typeof loginSchema>

import { describe, expect, it } from 'vitest'
import { loginSchema } from './authSchemas'

describe('loginSchema', () => {
  it('acepta el tenantId configurado aunque no sea un UUID RFC 4122 estricto', () => {
    const result = loginSchema.safeParse({
      username: 'admin',
      password: 'admin123',
      tenantId: '11111111-1111-1111-1111-111111111111',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza un tenantId que no tiene forma de UUID', () => {
    const result = loginSchema.safeParse({
      username: 'admin',
      password: 'admin123',
      tenantId: 'no-es-uuid',
    })
    expect(result.success).toBe(false)
  })
})

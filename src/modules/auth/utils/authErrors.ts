const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CREDENCIALES_INVALIDAS: 'Usuario o contraseña incorrectos.',
  USUARIO_BLOQUEADO: 'Tu cuenta está bloqueada. Contacta al administrador.',
  USUARIO_INACTIVO: 'Tu cuenta está inactiva. Contacta al administrador.',
  TOKEN_INVALIDO: 'Sesión inválida. Por favor inicia sesión nuevamente.',
  TOKEN_EXPIRADO: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  USUARIO_SIN_PERMISO: 'No tienes permisos para realizar esta acción.',
  TIMEOUT: 'El servidor no respondió a tiempo. Intenta nuevamente.',
  NETWORK_ERROR: 'No se pudo conectar con el backend. Abre el sistema desde http://localhost:5173/login y verifica que la API esté activa.',
  ERROR_DESCONOCIDO: 'No se pudo completar el acceso. Revisa la conexión e intenta nuevamente.',
}

export function getAuthErrorMessage(code?: string): string {
  if (!code) return 'Ocurrió un error inesperado. Intenta nuevamente.'
  return AUTH_ERROR_MESSAGES[code] ?? 'Ocurrió un error inesperado. Intenta nuevamente.'
}

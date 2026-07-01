import { LoginForm } from '@/modules/auth/components/LoginForm'
import { env } from '@/app/config/env'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{env.appName}</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de Gestión de Rutas de Recolección</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

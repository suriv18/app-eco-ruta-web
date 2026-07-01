import { LoginForm } from '@/modules/auth/components/LoginForm'
import { env } from '@/app/config/env'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10">
          {/* Logo / header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{env.appName}</h1>
            <p className="text-gray-500 text-sm mt-1">Sistema de Gestión de Rutas de Recolección</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200 text-xs mt-6">
          Sistema Municipal de Residuos Sólidos
        </p>
      </div>
    </div>
  )
}

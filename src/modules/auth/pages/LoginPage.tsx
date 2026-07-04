import { LoginForm } from '@/modules/auth/components/LoginForm'
import { env } from '@/app/config/env'

const operations = [
  { label: 'Rutas activas', value: '18' },
  { label: 'Unidades GPS', value: '42' },
  { label: 'Alertas críticas', value: '06' },
] as const

export function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-slate-900 px-10 py-8 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 opacity-45">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),transparent_42%),linear-gradient(315deg,rgba(6,182,212,0.10),transparent_38%)]" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25M4.5 19.5h15M5.25 19.5V5.75A1.25 1.25 0 016.5 4.5h11a1.25 1.25 0 011.25 1.25V19.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">{env.appName}</p>
              <p className="text-xs text-slate-400">Municipalidad Metropolitana de Lima</p>
            </div>
          </div>

          <div className="relative z-10 my-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Centro de control operativo
            </div>

            <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-white">
              Gestión municipal de recolección en tiempo real
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Acceso seguro para supervisar rutas, telemetría, alertas ciudadanas y KPIs operativos.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {operations.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 max-w-2xl rounded-lg border border-white/10 bg-slate-950/40 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Mapa operacional</p>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                  Online
                </span>
              </div>
              <div className="relative h-56 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute left-10 top-10 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(110,231,183,0.12)]" />
                <div className="absolute right-16 top-14 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_0_6px_rgba(103,232,249,0.12)]" />
                <div className="absolute bottom-12 left-1/3 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_0_6px_rgba(252,211,77,0.12)]" />
                <div className="absolute left-12 top-16 h-24 w-64 rotate-12 rounded-[50%] border-t-2 border-dashed border-emerald-300/70" />
                <div className="absolute bottom-16 right-12 h-28 w-72 -rotate-12 rounded-[50%] border-t-2 border-dashed border-cyan-300/60" />
                <div className="absolute bottom-6 left-6 rounded-md border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
                  Última sincronización: hace 2 min
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
            <span>API JWT + refresh token</span>
            <span>Auditoría de accesos habilitada</span>
          </div>
        </section>

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:bg-slate-100 lg:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:36px_36px] lg:hidden" />
          <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),transparent)] lg:hidden" />

          <div className="relative z-10 w-72 max-w-full min-w-0 sm:w-full sm:max-w-md">
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4 text-white shadow-2xl shadow-black/20 backdrop-blur lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25M4.5 19.5h15M5.25 19.5V5.75A1.25 1.25 0 016.5 4.5h11a1.25 1.25 0 011.25 1.25V19.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{env.appName}</p>
                <p className="truncate text-xs text-slate-300">Centro de control municipal</p>
              </div>
              <span className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                Online
              </span>
            </div>

            <div className="mb-5 grid min-w-0 grid-cols-3 gap-2 lg:hidden">
              {operations.map((item) => (
                <div key={item.label} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.06] p-3 text-white backdrop-blur">
                  <p className="text-lg font-semibold">{item.value}</p>
                  <p className="mt-1 truncate text-[11px] leading-tight text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="w-full min-w-0 rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8 lg:shadow-xl lg:shadow-slate-200/70">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase text-emerald-700">Acceso institucional</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Iniciar sesión</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ingresa con tu usuario municipal para continuar al panel operativo.
                </p>
              </div>

              <LoginForm />
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Sistema Municipal de Residuos Sólidos
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

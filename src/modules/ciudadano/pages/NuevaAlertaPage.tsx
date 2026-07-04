import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ciudadanoApi } from '@/modules/ciudadano/api/ciudadanoApi'
import { publicoApi } from '@/modules/ciudadano/api/publicoApi'
import { registrarAlertaSchema, type RegistrarAlertaFormData } from '@/modules/ciudadano/schemas/ciudadanoSchemas'
import {
  VOLUMENES, CRITICIDADES,
  VOLUMEN_LABEL, CRITICIDAD_LABEL,
  type AlertaCiudadanaResponseDto,
} from '@/modules/ciudadano/types/ciudadanoTypes'

// Tenant fijo para el portal público (en producción vendría de config/subdominio)
const TENANT_ID = import.meta.env.VITE_TENANT_ID as string | undefined ?? '00000000-0000-0000-0000-000000000001'

function useDistritosPublicos() {
  return useQuery({
    queryKey: ['publico', 'distritos'],
    queryFn: () => publicoApi.listarDistritos(),
  })
}

function CampoError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-red-600 mt-1">{msg}</p>
}

function inputBase(error?: string) {
  return `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-red-300 focus:ring-red-300 bg-red-50'
      : 'border-gray-300 focus:ring-green-400 focus:border-transparent'
  }`
}

function ConfirmacionExitosa({ alerta, onNueva }: { alerta: AlertaCiudadanaResponseDto; onNueva: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">¡Alerta registrada!</h2>
      <p className="text-gray-500 text-sm mb-6">
        Tu reporte fue recibido y será atendido a la brevedad.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-sm mb-6 max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-y-2">
          <span className="text-gray-500">N° de reporte</span>
          <span className="font-mono text-xs text-gray-700 break-all">{alerta.id.slice(0, 8).toUpperCase()}</span>
          <span className="text-gray-500">Título</span>
          <span className="font-medium text-gray-800">{alerta.titulo}</span>
          <span className="text-gray-500">Estado</span>
          <span className="text-green-700 font-medium">{alerta.estado}</span>
          <span className="text-gray-500">Registrado</span>
          <span className="text-gray-700">{new Date(alerta.registradaEn).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Guarda tu número de reporte para hacer seguimiento.
      </p>
      <button
        onClick={onNueva}
        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
      >
        Reportar otra alerta
      </button>
    </div>
  )
}

export function NuevaAlertaPage() {
  const [confirmacion, setConfirmacion] = useState<AlertaCiudadanaResponseDto | null>(null)
  const [usoGps, setUsoGps] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  const { data: distritos = [], isLoading: cargandoDistritos } = useDistritosPublicos()

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors }, reset,
  } = useForm<RegistrarAlertaFormData>({
    resolver: zodResolver(registrarAlertaSchema),
    defaultValues: { fuente: 'WEB' },
  })

  const latitud  = watch('latitud')
  const longitud = watch('longitud')

  const registrar = useMutation({
    mutationFn: (data: RegistrarAlertaFormData) =>
      ciudadanoApi.registrarAlerta(TENANT_ID, { ...data, fuente: data.fuente ?? 'WEB' }),
    onSuccess: (res) => setConfirmacion(res.data),
  })

  const obtenerUbicacion = () => {
    setGpsError(null)
    setUsoGps(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitud', pos.coords.latitude, { shouldValidate: true })
        setValue('longitud', pos.coords.longitude, { shouldValidate: true })
        setUsoGps(false)
      },
      () => {
        setGpsError('No se pudo obtener la ubicación. Ingresa las coordenadas manualmente.')
        setUsoGps(false)
      },
      { timeout: 10000 },
    )
  }

  if (confirmacion) {
    return <ConfirmacionExitosa alerta={confirmacion} onNueva={() => { setConfirmacion(null); reset() }} />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reportar una alerta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Informa sobre acumulación de residuos en tu zona. Tu reporte ayuda a mejorar la recolección.
        </p>
      </div>

      <form onSubmit={handleSubmit((d) => registrar.mutate(d))} className="space-y-6">
        {/* Información básica */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Descripción</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              {...register('titulo')}
              placeholder="Ej: Acumulación de basura en Av. Principal 423"
              className={inputBase(errors.titulo?.message)}
            />
            <CampoError msg={errors.titulo?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción adicional</label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Detalles adicionales sobre el problema..."
              className={`${inputBase()} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volumen estimado <span className="text-red-500">*</span>
              </label>
              <select {...register('volumenEstimado')} className={inputBase(errors.volumenEstimado?.message)}>
                <option value="">Selecciona...</option>
                {VOLUMENES.map((v) => (
                  <option key={v} value={v}>{VOLUMEN_LABEL[v]}</option>
                ))}
              </select>
              <CampoError msg={errors.volumenEstimado?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de criticidad <span className="text-red-500">*</span>
              </label>
              <select {...register('nivelCriticidad')} className={inputBase(errors.nivelCriticidad?.message)}>
                <option value="">Selecciona...</option>
                {CRITICIDADES.map((c) => (
                  <option key={c} value={c}>{CRITICIDAD_LABEL[c]}</option>
                ))}
              </select>
              <CampoError msg={errors.nivelCriticidad?.message} />
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Ubicación</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distrito <span className="text-red-500">*</span>
            </label>
            <select
              {...register('distritoExternoId')}
              disabled={cargandoDistritos}
              className={inputBase(errors.distritoExternoId?.message)}
            >
              <option value="">{cargandoDistritos ? 'Cargando...' : 'Selecciona un distrito'}</option>
              {distritos.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
            <CampoError msg={errors.distritoExternoId?.message} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Coordenadas GPS <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={obtenerUbicacion}
                disabled={usoGps}
                className="flex items-center gap-1.5 text-xs text-green-700 font-medium hover:text-green-800 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {usoGps ? 'Obteniendo...' : 'Usar mi ubicación'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  step="any"
                  placeholder="Latitud (ej: -12.046)"
                  {...register('latitud', { valueAsNumber: true })}
                  className={inputBase(errors.latitud?.message)}
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  placeholder="Longitud (ej: -77.042)"
                  {...register('longitud', { valueAsNumber: true })}
                  className={inputBase(errors.longitud?.message)}
                />
              </div>
            </div>

            {gpsError && <p className="text-xs text-red-600 mt-1">{gpsError}</p>}
            {(errors.latitud || errors.longitud) && (
              <p className="text-xs text-red-600 mt-1">La ubicación GPS es requerida</p>
            )}

            {latitud && longitud && (
              <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Ubicación capturada: {latitud.toFixed(5)}, {longitud.toFixed(5)}
              </p>
            )}
          </div>
        </section>

        {/* Error global */}
        {registrar.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            No se pudo enviar el reporte. Verifica tu conexión e intenta de nuevo.
          </div>
        )}

        <button
          type="submit"
          disabled={registrar.isPending}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {registrar.isPending ? 'Enviando reporte...' : 'Enviar reporte'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Al enviar, aceptas que esta información sea procesada por la municipalidad para mejorar el servicio de recolección.
        </p>
      </form>
    </div>
  )
}

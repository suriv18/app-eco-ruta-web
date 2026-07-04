import { useState } from 'react'
import { EstadoAlertaBadge, CriticidadBadge } from '@/modules/alertas/components/EstadoAlertaBadge'
import { CambiarEstadoModal } from '@/modules/alertas/components/CambiarEstadoModal'
import { ValidarAlertaModal } from '@/modules/alertas/components/ValidarAlertaModal'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { ESTADOS_TERMINALES } from '@/modules/alertas/types/alertasTypes'
import type { AlertaResponseDto } from '@/modules/alertas/types/alertasTypes'

const VOLUMEN_LABEL = { BAJO: 'Bajo', MEDIO: 'Medio', ALTO: 'Alto' }
const FUENTE_LABEL = { APP: 'App móvil', WEB: 'Web', OEFA: 'OEFA', OPERADOR: 'Operador' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

interface Props {
  alerta: AlertaResponseDto
  onBack?: () => void
}

export function AlertaDetalle({ alerta, onBack }: Props) {
  const [cambiarEstadoOpen, setCambiarEstadoOpen] = useState(false)
  const [validarOpen, setValidarOpen] = useState(false)
  const esTerminal = ESTADOS_TERMINALES.includes(alerta.estado)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {onBack && (
            <button onClick={onBack}
              className="text-sm text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
              ← Volver
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-900">{alerta.titulo}</h2>
          <div className="flex items-center gap-2 mt-2">
            <EstadoAlertaBadge estado={alerta.estado} />
            <CriticidadBadge nivel={alerta.nivelCriticidad} />
            <span className="text-xs text-gray-400">{FUENTE_LABEL[alerta.fuente]}</span>
          </div>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR', 'OPERADOR']}>
          <div className="flex gap-2 flex-shrink-0">
            {!esTerminal && (
              <button onClick={() => setCambiarEstadoOpen(true)}
                className="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Cambiar estado
              </button>
            )}
            <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
              {alerta.estado === 'REGISTRADA' && !alerta.validacion && (
                <button onClick={() => setValidarOpen(true)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Validar
                </button>
              )}
            </PermissionGuard>
          </div>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info principal */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Información</h3>
          {alerta.descripcion && (
            <p className="text-sm text-gray-600">{alerta.descripcion}</p>
          )}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500 text-xs">Volumen estimado</dt>
              <dd className="font-medium">{VOLUMEN_LABEL[alerta.volumenEstimado]}</dd>
            </div>
            <div>
              <dt className="text-gray-500 text-xs">Fuente</dt>
              <dd className="font-medium">{FUENTE_LABEL[alerta.fuente]}</dd>
            </div>
            <div>
              <dt className="text-gray-500 text-xs">Coordenadas</dt>
              <dd className="font-mono text-xs">{alerta.latitud.toFixed(6)}, {alerta.longitud.toFixed(6)}</dd>
            </div>
            <div>
              <dt className="text-gray-500 text-xs">Registrada</dt>
              <dd>{formatDate(alerta.registradaEn)}</dd>
            </div>
            <div>
              <dt className="text-gray-500 text-xs">Última actualización</dt>
              <dd>{formatDate(alerta.actualizadaEn)}</dd>
            </div>
          </dl>
        </div>

        {/* Validación */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Validación</h3>
          {alerta.validacion ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500 text-xs">Resultado</dt>
                <dd className="font-medium">{alerta.validacion.resultado}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">Score spam</dt>
                <dd className="font-mono">{(alerta.validacion.scoreSpam * 100).toFixed(0)}%</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">Dentro de geocerca</dt>
                <dd>{alerta.validacion.dentroGeocerca ? '✓ Sí' : '✗ No'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">¿Duplicada?</dt>
                <dd>{alerta.validacion.esDuplicada ? 'Sí' : 'No'}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500 text-xs">Validada en</dt>
                <dd>{formatDate(alerta.validacion.validadaEn)}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-400 italic">Pendiente de validación</p>
          )}
        </div>
      </div>

      {/* Fotos */}
      {alerta.fotos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
            Fotos ({alerta.fotos.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {alerta.fotos.map((foto) => (
              <a key={foto.id} href={foto.urlArchivo} target="_blank" rel="noopener noreferrer"
                className="block w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
                <img src={foto.urlArchivo} alt="Foto de alerta"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    if (t.parentElement) {
                      t.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-50">Sin preview</div>`
                    }
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Historial */}
      {alerta.historial.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
            Historial de cambios
          </h3>
          <ol className="relative border-l border-gray-200 space-y-4 ml-2">
            {alerta.historial.slice().reverse().map((h) => (
              <li key={h.historialId} className="ml-4">
                <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                <div className="text-xs text-gray-400 mb-0.5">{formatDate(h.cambiadoEn)}</div>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{h.estadoAnterior}</span>
                  {' → '}
                  <span className="font-medium text-blue-600">{h.estadoNuevo}</span>
                </p>
                {h.comentario && (
                  <p className="text-xs text-gray-500 mt-0.5 italic">"{h.comentario}"</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <CambiarEstadoModal alerta={alerta} isOpen={cambiarEstadoOpen} onClose={() => setCambiarEstadoOpen(false)} />
      <ValidarAlertaModal alerta={alerta} isOpen={validarOpen} onClose={() => setValidarOpen(false)} />
    </div>
  )
}

import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { env } from '@/app/config/env'
import type { WsPosicionPayload, WsDesvioPayload, WsAlertaCriticaPayload } from '@/modules/mapa/types/mapaTypes'

interface Handlers {
  onPosicion?: (p: WsPosicionPayload) => void
  onDesvio?: (p: WsDesvioPayload) => void
  onAlertaCritica?: (p: WsAlertaCriticaPayload) => void
}

export function useMapaWebSocket(handlers: Handlers) {
  const clientRef  = useRef<Client | null>(null)
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  const connect = useCallback(() => {
    const wsBase = env.wsUrl.replace(/^ws/, 'http')

    const client = new Client({
      webSocketFactory: () => new SockJS(wsBase),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/unidad.posicion.actualizada', (msg) => {
          try {
            const payload = JSON.parse(msg.body) as WsPosicionPayload
            handlersRef.current.onPosicion?.(payload)
          } catch { /* ignore malformed */ }
        })
        client.subscribe('/topic/unidad.sin.senal', (msg) => {
          try {
            const payload = JSON.parse(msg.body) as WsDesvioPayload
            handlersRef.current.onDesvio?.(payload)
          } catch { /* ignore malformed */ }
        })
        client.subscribe('/topic/alerta.critica.recibida', (msg) => {
          try {
            const payload = JSON.parse(msg.body) as WsAlertaCriticaPayload
            handlersRef.current.onAlertaCritica?.(payload)
          } catch { /* ignore malformed */ }
        })
      },
    })

    client.activate()
    clientRef.current = client
  }, [])

  useEffect(() => {
    connect()
    return () => {
      clientRef.current?.deactivate()
    }
  }, [connect])
}

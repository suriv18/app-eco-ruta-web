import { useEffect } from 'react'
import { wsClient } from '@/shared/websocket/websocketClient'
import type { WebSocketTopic } from '@/shared/websocket/websocketEvents'

export function useWebSocketSubscription<T>(
  topic: WebSocketTopic,
  callback: (data: T) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return
    const client = wsClient.getClient()
    if (!client?.connected) return
    const subscription = client.subscribe(topic, (msg) => {
      try {
        callback(JSON.parse(msg.body) as T)
      } catch {
        // silently ignore malformed messages
      }
    })
    return () => subscription.unsubscribe()
  }, [topic, callback, enabled])
}

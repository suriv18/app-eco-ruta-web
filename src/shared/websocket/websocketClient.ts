import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { env } from '@/app/config/env'

class WebSocketClient {
  private client: Client | null = null

  connect(token: string) {
    const wsUrl = env.wsUrl.replace('ws://', 'http://').replace('wss://', 'https://')
    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
    })
    this.client.activate()
    return this.client
  }

  disconnect() {
    this.client?.deactivate()
    this.client = null
  }

  getClient() {
    return this.client
  }
}

export const wsClient = new WebSocketClient()

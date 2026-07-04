import axios from 'axios'
import { env } from '@/app/config/env'

// Cliente sin autenticación para los endpoints públicos de ciudadanía
export const publicClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

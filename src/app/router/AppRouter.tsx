import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import { RoleRoute } from '@/app/router/RoleRoute'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { UnauthorizedPage } from '@/modules/auth/pages/UnauthorizedPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { RutasPage } from '@/modules/rutas/pages/RutasPage'
import { RutaDetallePage } from '@/modules/rutas/pages/RutaDetallePage'
import { AlertasPage } from '@/modules/alertas/pages/AlertasPage'
import { AlertasCriticasPage } from '@/modules/alertas/pages/AlertasCriticasPage'
import { AlertaDetallePage } from '@/modules/alertas/pages/AlertaDetallePage'
import { DistritosPage } from '@/modules/operacion/pages/DistritosPage'
import { ZonasPage } from '@/modules/operacion/pages/ZonasPage'
import { DepositosPage } from '@/modules/operacion/pages/DepositosPage'
import { ContenedoresPage } from '@/modules/operacion/pages/ContenedoresPage'
import { UnidadesPage } from '@/modules/operacion/pages/UnidadesPage'
import { ChoferesPage } from '@/modules/operacion/pages/ChoferesPage'
import { TurnosPage } from '@/modules/operacion/pages/TurnosPage'
import { HorariosRecoleccionPage } from '@/modules/operacion/pages/HorariosRecoleccionPage'
import { KpiResumenPage } from '@/modules/kpis/pages/KpiResumenPage'
import { KpiRutasPage } from '@/modules/kpis/pages/KpiRutasPage'
import { KpiUnidadesPage } from '@/modules/kpis/pages/KpiUnidadesPage'
import { KpiZonasPage } from '@/modules/kpis/pages/KpiZonasPage'
import { KpiAlertasPage } from '@/modules/kpis/pages/KpiAlertasPage'
import { EventosAuditoriaPage } from '@/modules/auditoria/pages/EventosAuditoriaPage'
import { OutboxPage } from '@/modules/auditoria/pages/OutboxPage'
import { MapaPage } from '@/modules/mapa/pages/MapaPage'
import { PublicoLayout } from '@/app/layouts/PublicoLayout'
import { NuevaAlertaPage } from '@/modules/ciudadano/pages/NuevaAlertaPage'
import { HorariosPublicosPage } from '@/modules/ciudadano/pages/HorariosPublicosPage'
import { ROUTES } from '@/app/config/routePaths'

const OPERACION_ROLES = ['ADMIN', 'SUPERVISOR'] as const

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Portal público ciudadano — sin autenticación */}
        <Route element={<PublicoLayout />}>
          <Route path={ROUTES.PUBLICO.ALERTA_NUEVA} element={<NuevaAlertaPage />} />
          <Route path={ROUTES.PUBLICO.HORARIOS} element={<HorariosPublicosPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path={ROUTES.MAPA} element={<MapaPage />} />

            {/* Rutas */}
            <Route element={<RoleRoute roles={['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA']} />}>
              <Route path={ROUTES.RUTAS.LIST} element={<RutasPage />} />
              <Route path="/rutas/:id" element={<RutaDetallePage />} />
            </Route>

            {/* Alertas */}
            <Route element={<RoleRoute roles={['ADMIN', 'SUPERVISOR', 'OPERADOR']} />}>
              <Route path={ROUTES.ALERTAS.LIST} element={<AlertasPage />} />
              <Route path={ROUTES.ALERTAS.CRITICAS} element={<AlertasCriticasPage />} />
              <Route path="/alertas/:id" element={<AlertaDetallePage />} />
            </Route>

            {/* Operacion */}
            <Route element={<RoleRoute roles={[...OPERACION_ROLES, 'OPERADOR', 'ANALISTA']} />}>
              <Route path={ROUTES.OPERACION.DISTRITOS} element={<DistritosPage />} />
              <Route path={ROUTES.OPERACION.ZONAS} element={<ZonasPage />} />
              <Route path={ROUTES.OPERACION.DEPOSITOS} element={<DepositosPage />} />
              <Route path={ROUTES.OPERACION.CONTENEDORES} element={<ContenedoresPage />} />
              <Route path={ROUTES.OPERACION.UNIDADES} element={<UnidadesPage />} />
              <Route path={ROUTES.OPERACION.CHOFERES} element={<ChoferesPage />} />
              <Route path={ROUTES.OPERACION.TURNOS} element={<TurnosPage />} />
              <Route path={ROUTES.OPERACION.HORARIOS} element={<HorariosRecoleccionPage />} />
            </Route>

            {/* KPIs */}
            <Route element={<RoleRoute roles={['ADMIN', 'SUPERVISOR', 'ANALISTA']} />}>
              <Route path={ROUTES.KPIS.RESUMEN} element={<KpiResumenPage />} />
              <Route path={ROUTES.KPIS.RUTAS} element={<KpiRutasPage />} />
              <Route path={ROUTES.KPIS.UNIDADES} element={<KpiUnidadesPage />} />
              <Route path={ROUTES.KPIS.ZONAS} element={<KpiZonasPage />} />
              <Route path={ROUTES.KPIS.ALERTAS} element={<KpiAlertasPage />} />
            </Route>

            {/* Auditoría */}
            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path={ROUTES.AUDITORIA.EVENTOS} element={<EventosAuditoriaPage />} />
              <Route path={ROUTES.AUDITORIA.OUTBOX} element={<OutboxPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

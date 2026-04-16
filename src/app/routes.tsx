import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Alertas } from './pages/Alertas';
import { Reportes } from './pages/Reportes';
import { Configuracion } from './pages/Configuracion';
import { Usuarios } from './pages/Usuarios';
import { AppProvider } from './context/AppContext';

function AppLayout() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/app',
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'alertas', Component: Alertas },
      { path: 'reportes', Component: Reportes },
      { path: 'configuracion', Component: Configuracion },
      { path: 'usuarios', Component: Usuarios },
    ],
  },
]);

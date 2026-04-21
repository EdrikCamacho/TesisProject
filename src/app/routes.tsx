import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Alertas } from './pages/Alertas';
import { Reportes } from './pages/Reportes';
import { Configuracion } from './pages/Configuracion';
import { Usuarios } from './pages/Usuarios';
import { AppProvider } from './context/AppContext';
import { Navigate } from "react-router";
import { JSX } from 'react/jsx-runtime';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
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
    element: <Login />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'alertas', element: <Alertas /> },
      { path: 'reportes', element: <Reportes /> },
      { path: 'configuracion', element: <Configuracion /> },
      { path: 'usuarios', element: <Usuarios /> },
    ],
  },
]);
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
  activeCameraName: string;
  setActiveCameraName: (v: string) => void;
  currentUser: { name: string; role: string };
  usuario: any;
  token: string;
  logout: () => void;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextType>({
  sidebarExpanded: true,
  setSidebarExpanded: () => {},
  activeCameraName: 'CÁMARA 01 — Blvd. Macario Gaxiola',
  setActiveCameraName: () => {},
  currentUser: { name: 'Operador García', role: 'Operador' },
  usuario: null,
  token: '',
  logout: () => {},
  isAdmin: false,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeCameraName, setActiveCameraName] = useState('CÁMARA 01 — Blvd. Macario Gaxiola');
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const currentUser = usuario
    ? { name: usuario.nombre, role: usuario.rol }
    : { name: 'Operador García', role: 'Operador' };

  const isAdmin = usuario?.id_rol === 1;

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken('');
  };

  return (
    <AppContext.Provider value={{ sidebarExpanded, setSidebarExpanded, activeCameraName, setActiveCameraName, currentUser, usuario, token, logout, isAdmin }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

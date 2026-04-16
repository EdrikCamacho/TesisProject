import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
  activeCameraName: string;
  setActiveCameraName: (v: string) => void;
  currentUser: { name: string; role: string };
}

const AppContext = createContext<AppContextType>({
  sidebarExpanded: true,
  setSidebarExpanded: () => {},
  activeCameraName: 'CÁMARA 01 — Blvd. Macario Gaxiola',
  setActiveCameraName: () => {},
  currentUser: { name: 'Operador García', role: 'Operador' },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeCameraName, setActiveCameraName] = useState('CÁMARA 01 — Blvd. Macario Gaxiola');
  const currentUser = { name: 'Operador García', role: 'Operador' };

  return (
    <AppContext.Provider value={{ sidebarExpanded, setSidebarExpanded, activeCameraName, setActiveCameraName, currentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

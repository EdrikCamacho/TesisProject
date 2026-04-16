import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Bell, FileBarChart2, Settings, Users,
  ChevronLeft, ChevronRight, LogOut, Shield, Camera
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { label: 'Dashboard en Vivo', icon: LayoutDashboard, path: '/app' },
  { label: 'Alertas', icon: Bell, path: '/app/alertas' },
  { label: 'Reportes', icon: FileBarChart2, path: '/app/reportes' },
  { label: 'Configuración', icon: Settings, path: '/app/configuracion' },
  { label: 'Usuarios', icon: Users, path: '/app/usuarios' },
];

export function Layout() {
  const { sidebarExpanded, setSidebarExpanded, activeCameraName, currentUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app' || location.pathname === '/app/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0D1B2A', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col h-full transition-all duration-300 flex-shrink-0"
        style={{
          width: sidebarExpanded ? '220px' : '64px',
          background: '#080F1A',
          borderRight: '1px solid #263D52',
        }}
      >
        {/* Logo */}
        <div className="flex items-center px-4 py-4" style={{ minHeight: '64px', borderBottom: '1px solid #263D52' }}>
          <div className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 36, height: 36, background: '#1E90FF', fontWeight: 800, color: '#fff', fontSize: 13 }}>
            SMVI
          </div>
          {sidebarExpanded && (
            <div className="ml-3 overflow-hidden">
              <div style={{ color: '#1E90FF', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>SMVI</div>
              <div style={{ color: '#6B7280', fontSize: 10, whiteSpace: 'nowrap' }}>Monitoreo Vial</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 rounded-lg transition-all duration-200 relative group"
                style={{
                  padding: sidebarExpanded ? '10px 12px' : '10px',
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  background: active ? 'rgba(30,144,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(30,144,255,0.3)' : '1px solid transparent',
                  color: active ? '#1E90FF' : '#8899AA',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#8899AA';
                  }
                }}
              >
                {item.path === '/app/alertas' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full pulse-red" style={{ background: '#FF3B3B' }} />
                )}
                <item.icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {sidebarExpanded && (
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div style={{ padding: '12px', borderTop: '1px solid #263D52' }}>
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="flex items-center justify-center w-full rounded-lg transition-colors"
            style={{ padding: '8px', color: '#6B7280', background: 'transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
          >
            {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            {sidebarExpanded && <span style={{ fontSize: 12, marginLeft: 8 }}>Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar */}
        <header className="flex items-center px-6 flex-shrink-0"
          style={{ height: '64px', background: '#080F1A', borderBottom: '1px solid #263D52' }}>
          {/* Left: Logo text */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ minWidth: 140 }}>
            <Camera size={16} style={{ color: '#1E90FF' }} />
            <span style={{ color: '#1E90FF', fontWeight: 700, fontSize: 13 }}>Sistema de Monitoreo Vial</span>
          </div>

          {/* Center: Active camera */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(30,144,255,0.1)', border: '1px solid rgba(30,144,255,0.25)' }}>
              <span className="w-2 h-2 rounded-full rec-blink" style={{ background: '#22C55E' }} />
              <span style={{ color: '#E2EAF0', fontSize: 12, fontWeight: 500 }}>{activeCameraName}</span>
            </div>
          </div>

          {/* Right: User info */}
          <div className="flex items-center gap-3 flex-shrink-0" style={{ minWidth: 140, justifyContent: 'flex-end' }}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full"
                style={{ width: 32, height: 32, background: '#1A2B3C', border: '1px solid #263D52' }}>
                <Users size={14} style={{ color: '#8899AA' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#E2EAF0' }}>{currentUser.name}</div>
                <div className="flex items-center gap-1">
                  <Shield size={10} style={{ color: '#1E90FF' }} />
                  <span style={{ fontSize: 10, color: '#1E90FF', fontWeight: 500 }}>{currentUser.role}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
              style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.25)', color: '#FF3B3B', fontSize: 12 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,59,59,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,59,59,0.1)'; }}
            >
              <LogOut size={12} />
              Salir
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto" style={{ background: '#0D1B2A' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

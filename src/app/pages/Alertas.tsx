import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TriangleAlert, Clock, Camera, CheckCircle, ExternalLink, Filter, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Alert {
  id: number;
  status: 'ACTIVA' | 'ATENDIDA';
  borderColor: string;
  title: string;
  camera: string;
  time: string;
  object: string;
  attendedBy?: string;
}

const alertsData: Alert[] = [
  {
    id: 1,
    status: 'ACTIVA',
    borderColor: '#FF3B3B',
    title: 'Vehículo Detenido en Carril Rápido',
    camera: 'CAM 01 — Blvd. Macario Gaxiola',
    time: 'Hoy 14:32:17',
    object: 'Auto ID:31 — Detenido 02:14s',
  },
  {
    id: 2,
    status: 'ACTIVA',
    borderColor: '#F59E0B',
    title: 'Exceso de Velocidad Detectado',
    camera: 'CAM 02 — Av. Jiquilpan',
    time: 'Hoy 14:28:05',
    object: 'Camión ID:07 — 87.4 km/h (límite 60 km/h)',
  },
  {
    id: 3,
    status: 'ATENDIDA',
    borderColor: '#4B5563',
    title: 'Congestión Extrema',
    camera: 'CAM 01 — Blvd. Macario Gaxiola',
    time: 'Hoy 13:55:40',
    object: 'Zona saturada — Flujo crítico detectado',
    attendedBy: 'Operador García',
  },
];

export function Alertas() {
  const { setActiveCameraName } = useAppContext();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(alertsData);
  const [filter, setFilter] = useState('Todas');
  const [attending, setAttending] = useState<number | null>(null);

  useEffect(() => {
    setActiveCameraName('Panel de Alertas — SMVI');
  }, []);

  const activeCount = alerts.filter((a) => a.status === 'ACTIVA').length;

  const filtered = alerts.filter((a) => {
    if (filter === 'Activas') return a.status === 'ACTIVA';
    if (filter === 'Atendidas') return a.status === 'ATENDIDA';
    return true;
  });

  const markAttended = (id: number) => {
    setAttending(id);
    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: 'ATENDIDA', borderColor: '#4B5563', attendedBy: 'Operador García' } : a)
      );
      setAttending(null);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-5 p-5" style={{ color: '#E2EAF0', maxWidth: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>Alertas de Anomalías</h1>
          {activeCount > 0 && (
            <span className="rounded-full px-3 py-1 pulse-red"
              style={{ background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.4)', color: '#FF3B3B', fontSize: 13, fontWeight: 700 }}>
              {activeCount} {activeCount === 1 ? 'alerta activa' : 'alertas activas'}
            </span>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          <Filter size={14} style={{ color: '#6B7280' }} />
          {/* Status filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                background: '#1A2B3C',
                border: '1px solid #263D52',
                borderRadius: 8,
                padding: '8px 32px 8px 12px',
                color: '#E2EAF0',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              <option>Todas</option>
              <option>Activas</option>
              <option>Atendidas</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
          </div>

          {/* Date picker */}
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <Calendar size={13} style={{ color: '#6B7280' }} />
            <input
              type="date"
              defaultValue="2026-03-13"
              style={{ background: 'transparent', border: 'none', color: '#E2EAF0', fontSize: 13, outline: 'none', cursor: 'pointer' }}
            />
          </div>

          {/* Camera selector */}
          <div className="relative">
            <select style={{
              background: '#1A2B3C',
              border: '1px solid #263D52',
              borderRadius: 8,
              padding: '8px 32px 8px 12px',
              color: '#E2EAF0',
              fontSize: 13,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
            }}>
              <option>Todas las cámaras</option>
              <option>CAM 01</option>
              <option>CAM 02</option>
              <option>CAM 03</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <MiniStatCard label="Alertas activas hoy" value={String(activeCount)} color="#FF3B3B" />
        <MiniStatCard label="Atendidas hoy" value={String(alerts.filter(a => a.status === 'ATENDIDA').length)} color="#22C55E" />
        <MiniStatCard label="Tiempo promedio atención" value="3:42 min" color="#F59E0B" />
      </div>

      {/* Alert Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onMarkAttended={() => markAttended(alert.id)}
            onViewDashboard={() => navigate('/app')}
            attending={attending === alert.id}
          />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <CheckCircle size={40} style={{ color: '#22C55E', marginBottom: 12 }} />
            <p style={{ color: '#22C55E', fontWeight: 600, fontSize: 15 }}>No hay alertas en esta categoría</p>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>El sistema opera con normalidad</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert, onMarkAttended, onViewDashboard, attending }: {
  alert: Alert;
  onMarkAttended: () => void;
  onViewDashboard: () => void;
  attending: boolean;
}) {
  const isActive = alert.status === 'ACTIVA';
  const isRed = alert.borderColor === '#FF3B3B';

  return (
    <div className="rounded-xl overflow-hidden flex transition-all"
      style={{
        background: '#1A2B3C',
        border: '1px solid #263D52',
        borderLeft: `4px solid ${alert.borderColor}`,
        opacity: isActive ? 1 : 0.65,
      }}>
      {/* Main content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TriangleAlert size={18} style={{ color: alert.borderColor, flexShrink: 0 }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: isActive ? '#FFFFFF' : '#8899AA' }}>
              {alert.title}
            </h3>
          </div>
          <StatusBadge status={alert.status} color={alert.borderColor} />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Camera size={13} style={{ color: '#6B7280' }} />
            <span style={{ fontSize: 13, color: '#8899AA' }}>{alert.camera}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} style={{ color: '#6B7280' }} />
            <span style={{ fontSize: 13, color: '#8899AA' }}>{alert.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{
          background: isActive ? `rgba(${isRed ? '255,59,59' : '245,158,11'}, 0.06)` : 'rgba(75,85,99,0.1)',
          border: `1px solid ${isActive ? (isRed ? 'rgba(255,59,59,0.2)' : 'rgba(245,158,11,0.2)') : 'rgba(75,85,99,0.2)'}`,
        }}>
          <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Objeto:</span>
          <span style={{ fontSize: 13, color: isActive ? '#E2EAF0' : '#6B7280', fontFamily: 'monospace' }}>
            {alert.object}
          </span>
        </div>

        {!isActive && alert.attendedBy && (
          <div className="flex items-center gap-2">
            <CheckCircle size={13} style={{ color: '#22C55E' }} />
            <span style={{ fontSize: 12, color: '#22C55E' }}>Atendida por: {alert.attendedBy}</span>
          </div>
        )}
      </div>

      {/* Right side: thumbnail + actions */}
      <div className="flex flex-col items-end justify-between p-5 gap-3 flex-shrink-0" style={{ width: 220 }}>
        {/* Thumbnail */}
        <div className="rounded-lg overflow-hidden relative" style={{
          width: 160, height: 90,
          background: '#080F1A',
          border: `1px solid ${alert.borderColor}40`,
          flexShrink: 0,
        }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%">
              <rect x="30%" y="20%" width="40%" height="60%" fill="none" stroke={alert.borderColor} strokeWidth="1.5"
                strokeDasharray={isActive ? "4,2" : "0"} rx="2" />
              <circle cx="30%" cy="20%" r="3" fill={alert.borderColor} />
              <circle cx="70%" cy="20%" r="3" fill={alert.borderColor} />
              <circle cx="30%" cy="80%" r="3" fill={alert.borderColor} />
              <circle cx="70%" cy="80%" r="3" fill={alert.borderColor} />
            </svg>
          </div>
          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
            <span style={{ fontSize: 8, color: alert.borderColor, background: `${alert.borderColor}20`, padding: '1px 4px', borderRadius: 3 }}>
              {alert.camera.split('—')[0].trim()}
            </span>
            {isActive && (
              <span className="rec-blink" style={{ fontSize: 8, color: '#FF3B3B' }}>● LIVE</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {isActive ? (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={onViewDashboard}
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all"
              style={{ background: 'transparent', border: '1px solid #1E90FF', color: '#1E90FF', fontSize: 12, cursor: 'pointer', width: '100%' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(30,144,255,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <ExternalLink size={12} />
              Ver en Dashboard
            </button>
            <button
              onClick={onMarkAttended}
              disabled={attending}
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all"
              style={{ background: '#FF3B3B', border: 'none', color: '#fff', fontSize: 12, cursor: attending ? 'not-allowed' : 'pointer', width: '100%', opacity: attending ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!attending) (e.currentTarget as HTMLButtonElement).style.background = '#e63030'; }}
              onMouseLeave={(e) => { if (!attending) (e.currentTarget as HTMLButtonElement).style.background = '#FF3B3B'; }}
            >
              {attending ? (
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <CheckCircle size={12} />
              )}
              {attending ? 'Procesando...' : 'Marcar Atendida'}
            </button>
          </div>
        ) : (
          <button
            onClick={onViewDashboard}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2"
            style={{ background: 'transparent', border: '1px solid #263D52', color: '#6B7280', fontSize: 12, cursor: 'pointer', width: '100%' }}
          >
            <ExternalLink size={12} />
            Ver historial
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span className="rounded-full px-3 py-1"
      style={{
        background: `${color}20`,
        border: `1px solid ${color}50`,
        color: color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}>
      {status}
    </span>
  );
}

function MiniStatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
      <span style={{ fontSize: 26, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
    </div>
  );
}

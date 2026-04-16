import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Car, PersonStanding, Gauge, TriangleAlert, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { useAppContext } from '../context/AppContext';

const lineData = [
  { time: '14:20', vehiculos: 118, peatones: 42 },
  { time: '14:22', vehiculos: 145, peatones: 55 },
  { time: '14:24', vehiculos: 132, peatones: 48 },
  { time: '14:26', vehiculos: 162, peatones: 64 },
  { time: '14:28', vehiculos: 156, peatones: 57 },
  { time: '14:30', vehiculos: 149, peatones: 61 },
];

const detectionRows = [
  { ts: '14:30:18', cam: 'CAM 01', tipo: 'Automóvil', id: 'ID:14', vel: '38.2 km/h', estado: 'Normal', anomaly: false },
  { ts: '14:30:14', cam: 'CAM 02', tipo: 'Peatón', id: 'ID:22', vel: '—', estado: 'Normal', anomaly: false },
  { ts: '14:30:09', cam: 'CAM 01', tipo: 'Camión', id: 'ID:07', vel: '52.1 km/h', estado: 'Normal', anomaly: false },
  { ts: '14:29:55', cam: 'CAM 03', tipo: 'Motocicleta', id: 'ID:45', vel: '44.7 km/h', estado: 'Normal', anomaly: false },
  { ts: '14:29:40', cam: 'CAM 02', tipo: 'Autobús', id: 'ID:03', vel: '29.5 km/h', estado: 'Normal', anomaly: false },
  { ts: '14:29:22', cam: 'CAM 01', tipo: 'Automóvil', id: 'ID:31', vel: '0.0 km/h', estado: '⚠ Anomalía', anomaly: true },
];

const cameras = ['CAM 01', 'CAM 02', 'CAM 03'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A2B3C', border: '1px solid #263D52', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#8899AA', fontSize: 11, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            <span style={{ color: '#E2EAF0', fontSize: 12 }}>{p.name}: <strong>{p.value}</strong></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { setActiveCameraName } = useAppContext();
  const [activeCamera, setActiveCamera] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setActiveCameraName('CÁMARA 01 — Blvd. Macario Gaxiola');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-5 min-h-full" style={{ color: '#E2EAF0' }}>

      {/* TOP ROW — KPI Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {/* Vehículos Totales */}
        <KPICard
          icon={<Car size={20} style={{ color: '#1E90FF' }} />}
          value="1,247"
          label="Vehículos Totales"
          badge="+12%"
          badgeColor="#22C55E"
          badgeDir="up"
        />
        {/* Peatones Totales */}
        <KPICard
          icon={<PersonStanding size={20} style={{ color: '#1E90FF' }} />}
          value="389"
          label="Peatones Totales"
          badge="+5%"
          badgeColor="#22C55E"
          badgeDir="up"
        />
        {/* Velocidad Promedio */}
        <KPICard
          icon={<Gauge size={20} style={{ color: '#F59E0B' }} />}
          value="42.3 km/h"
          label="Velocidad Promedio"
          badge="—"
          badgeColor="#F59E0B"
          badgeDir="neutral"
        />
        {/* Alertas Activas */}
        <KPICard
          icon={<TriangleAlert size={20} style={{ color: '#FF3B3B' }} />}
          value="3"
          label="Alertas Activas"
          badge="Activo"
          badgeColor="#FF3B3B"
          badgeDir="alert"
          pulse
        />
      </div>

      {/* MIDDLE ROW */}
      <div className="flex gap-4" style={{ minHeight: 420 }}>
        {/* LEFT — Camera feed 60% */}
        <div className="flex flex-col gap-3" style={{ flex: '0 0 60%' }}>
          <div className="rounded-xl overflow-hidden" style={{
            background: '#1A2B3C',
            border: '1px solid #263D52',
            flex: 1,
          }}>
            {/* Camera feed */}
            <div className="relative" style={{ paddingTop: '56.25%', background: '#080F1A' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(30,144,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }} />

                {/* Perspective lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
                  <line x1="50%" y1="0%" x2="0%" y2="100%" stroke="#1E90FF" strokeWidth="0.5" />
                  <line x1="50%" y1="0%" x2="100%" y2="100%" stroke="#1E90FF" strokeWidth="0.5" />
                  <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#1E90FF" strokeWidth="0.5" />
                </svg>

                {/* Road markings */}
                <div className="absolute" style={{ bottom: '20%', left: '10%', right: '10%', height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
                <div className="absolute" style={{ bottom: '22%', left: '25%', right: '25%', height: 1, background: 'rgba(255,255,200,0.06)', borderRadius: 1 }} />

                {/* Bounding Boxes SVG */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Auto ID:14 - green */}
                  <rect x="10%" y="30%" width="18%" height="22%" fill="none" stroke="#22C55E" strokeWidth="1.5" rx="2" />
                  <rect x="10%" y="28%" width="80" height="18" fill="rgba(34,197,94,0.8)" rx="3" />
                  <text x="calc(10% + 5px)" y="28%" dy="13" fontSize="10" fill="white" fontFamily="Inter">Auto ID:14</text>
                  {/* Filled indicator corner */}
                  <circle cx="10%" cy="30%" r="3" fill="#22C55E" />
                  <circle cx="28%" cy="30%" r="3" fill="#22C55E" />
                  <circle cx="10%" cy="52%" r="3" fill="#22C55E" />
                  <circle cx="28%" cy="52%" r="3" fill="#22C55E" />

                  {/* Camión ID:07 - green */}
                  <rect x="45%" y="20%" width="25%" height="38%" fill="none" stroke="#22C55E" strokeWidth="1.5" rx="2" />
                  <rect x="45%" y="18%" width="88" height="18" fill="rgba(34,197,94,0.8)" rx="3" />
                  <text x="calc(45% + 5px)" y="18%" dy="13" fontSize="10" fill="white" fontFamily="Inter">Camión ID:07</text>
                  <circle cx="45%" cy="20%" r="3" fill="#22C55E" />
                  <circle cx="70%" cy="20%" r="3" fill="#22C55E" />
                  <circle cx="45%" cy="58%" r="3" fill="#22C55E" />
                  <circle cx="70%" cy="58%" r="3" fill="#22C55E" />

                  {/* Peatón ID:22 - green */}
                  <rect x="78%" y="35%" width="10%" height="28%" fill="none" stroke="#22C55E" strokeWidth="1.5" rx="2" />
                  <rect x="74%" y="33%" width="80" height="18" fill="rgba(34,197,94,0.8)" rx="3" />
                  <text x="calc(74% + 5px)" y="33%" dy="13" fontSize="10" fill="white" fontFamily="Inter">Peatón ID:22</text>
                  <circle cx="78%" cy="35%" r="3" fill="#22C55E" />
                  <circle cx="88%" cy="35%" r="3" fill="#22C55E" />
                  <circle cx="78%" cy="63%" r="3" fill="#22C55E" />
                  <circle cx="88%" cy="63%" r="3" fill="#22C55E" />

                  {/* Auto ID:31 - yellow dashed ANOMALY */}
                  <rect x="30%" y="45%" width="18%" height="20%"
                    fill="rgba(245,158,11,0.05)" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5,3" rx="2" />
                  <rect x="30%" y="43%" width="138" height="18" fill="rgba(245,158,11,0.85)" rx="3" />
                  <text x="calc(30% + 5px)" y="43%" dy="13" fontSize="10" fill="white" fontFamily="Inter">Auto ID:31 ⚠ Detenido 00:34s</text>
                  <circle cx="30%" cy="45%" r="3" fill="#F59E0B" />
                  <circle cx="48%" cy="45%" r="3" fill="#F59E0B" />
                  <circle cx="30%" cy="65%" r="3" fill="#F59E0B" />
                  <circle cx="48%" cy="65%" r="3" fill="#F59E0B" />

                  {/* Cyan counting line */}
                  <line x1="5%" y1="80%" x2="95%" y2="80%"
                    stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="8,4" />
                  <text x="5%" y="79%" fontSize="9" fill="#00E5FF" fontFamily="Inter">— Línea de conteo</text>

                  {/* Count labels on line */}
                  <text x="88%" y="78%" fontSize="9" fill="#00E5FF" fontFamily="Inter">↕ 847</text>
                </svg>

                {/* Top-left label */}
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded px-2 py-1"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                  <span style={{ color: '#E2EAF0', fontSize: 11, fontWeight: 600 }}>
                    CÁMARA 01 — Blvd. Macario Gaxiola
                  </span>
                </div>

                {/* Top-right REC */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded px-2 py-1"
                  style={{ background: 'rgba(0,0,0,0.65)' }}>
                  <span className="w-2 h-2 rounded-full rec-blink" style={{ background: '#FF3B3B' }} />
                  <span style={{ color: '#FF3B3B', fontSize: 11, fontWeight: 700 }}>REC</span>
                  <span style={{ color: '#6B7280', fontSize: 10, marginLeft: 4 }}>
                    {String(Math.floor(tick / 3600)).padStart(2, '0')}:{String(Math.floor((tick % 3600) / 60)).padStart(2, '0')}:{String(tick % 60).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom stats bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5"
                  style={{ background: 'rgba(0,0,0,0.7)' }}>
                  <div className="flex items-center gap-4">
                    <StatPill color="#22C55E" label="Autos" value="3" />
                    <StatPill color="#1E90FF" label="Camiones" value="1" />
                    <StatPill color="#A855F7" label="Peatones" value="1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 10, color: '#F59E0B' }}>⚠ 1 Anomalía</span>
                    <span style={{ fontSize: 10, color: '#6B7280' }}>IPM: activo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera selector */}
            <div className="flex items-center gap-0 px-4 py-2" style={{ borderTop: '1px solid #263D52' }}>
              <button style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
                <ChevronLeft size={14} />
              </button>
              {cameras.map((cam, i) => (
                <button
                  key={cam}
                  onClick={() => setActiveCamera(i)}
                  className="rounded px-3 py-1 transition-all"
                  style={{
                    fontSize: 12,
                    fontWeight: i === activeCamera ? 600 : 400,
                    color: i === activeCamera ? '#1E90FF' : '#6B7280',
                    background: i === activeCamera ? 'rgba(30,144,255,0.1)' : 'transparent',
                    border: i === activeCamera ? '1px solid rgba(30,144,255,0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                    marginRight: 4,
                  }}
                >
                  {cam}
                </button>
              ))}
              <button style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
                <ChevronRight size={14} />
              </button>
              <button className="flex items-center gap-1 ml-2 rounded px-2 py-1 transition-colors"
                style={{ fontSize: 11, color: '#1E90FF', background: 'rgba(30,144,255,0.08)', border: '1px solid rgba(30,144,255,0.2)', cursor: 'pointer' }}>
                <Plus size={11} />
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Chart + density 40% */}
        <div className="flex flex-col gap-3" style={{ flex: '0 0 40%' }}>
          {/* Line chart */}
          <div className="rounded-xl p-4 flex-1" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0' }}>Flujo vehicular — últimos 10 min</h3>
              <span style={{ fontSize: 11, color: '#6B7280' }}>Tiempo real</span>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,61,82,0.8)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 200]} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8899AA', paddingTop: 8 }} />
                  <Line type="monotone" dataKey="vehiculos" stroke="#1E90FF" strokeWidth={2}
                    dot={{ r: 3, fill: '#1E90FF', strokeWidth: 0 }}
                    activeDot={{ r: 5 }} name="Vehículos" />
                  <Line type="monotone" dataKey="peatones" stroke="#F97316" strokeWidth={2}
                    dot={{ r: 3, fill: '#F97316', strokeWidth: 0 }}
                    activeDot={{ r: 5 }} name="Peatones" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Density bar */}
          <div className="rounded-xl p-4" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0' }}>Densidad actual</span>
              <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', fontSize: 11, color: '#F59E0B', fontWeight: 600 }}>
                MODERADO
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ background: '#0D1B2A', height: 12 }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{
                width: '68%',
                background: 'linear-gradient(90deg, #1E90FF, #F59E0B)',
              }} />
            </div>
            <div className="flex justify-between mt-2">
              <span style={{ fontSize: 11, color: '#6B7280' }}>0%</span>
              <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>68%</span>
              <span style={{ fontSize: 11, color: '#6B7280' }}>100%</span>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #263D52' }}>
              <MiniStat label="Entrantes" value="89/min" color="#1E90FF" />
              <MiniStat label="Salientes" value="76/min" color="#22C55E" />
              <MiniStat label="En zona" value="247" color="#F59E0B" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW — Detections table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #263D52' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0' }}>Detecciones Recientes</h3>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, color: '#6B7280' }}>Actualización en tiempo real</span>
            <span className="w-2 h-2 rounded-full rec-blink" style={{ background: '#22C55E' }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#111C2B' }}>
              {['Timestamp', 'Cámara', 'Tipo', 'ID Rastreo', 'Velocidad', 'Estado'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detectionRows.map((row, i) => (
              <tr key={i}
                style={{
                  background: row.anomaly ? 'rgba(255,59,59,0.08)' : i % 2 === 0 ? '#111C2B' : '#1A2B3C',
                  borderBottom: '1px solid rgba(38,61,82,0.5)',
                  borderLeft: row.anomaly ? '3px solid #FF3B3B' : '3px solid transparent',
                }}>
                <td style={{ padding: '9px 16px', fontSize: 12, color: '#8899AA', fontFamily: 'monospace' }}>{row.ts}</td>
                <td style={{ padding: '9px 16px' }}>
                  <span className="rounded px-2 py-0.5" style={{ fontSize: 11, background: 'rgba(30,144,255,0.1)', color: '#1E90FF', fontWeight: 500 }}>{row.cam}</span>
                </td>
                <td style={{ padding: '9px 16px', fontSize: 12, color: '#E2EAF0' }}>{row.tipo}</td>
                <td style={{ padding: '9px 16px', fontSize: 12, color: '#8899AA', fontFamily: 'monospace' }}>{row.id}</td>
                <td style={{ padding: '9px 16px', fontSize: 12, color: row.vel === '0.0 km/h' ? '#FF3B3B' : '#E2EAF0', fontWeight: row.vel === '0.0 km/h' ? 600 : 400 }}>{row.vel}</td>
                <td style={{ padding: '9px 16px' }}>
                  {row.anomaly ? (
                    <span className="rounded-full px-2 py-0.5 pulse-red" style={{ fontSize: 11, background: 'rgba(255,59,59,0.15)', color: '#FF3B3B', fontWeight: 600 }}>
                      {row.estado}
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 11, background: 'rgba(34,197,94,0.12)', color: '#22C55E', fontWeight: 500 }}>
                      {row.estado}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #263D52' }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Mostrando 6 de 1,247 detecciones</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 208].map((p, i) => (
              <button key={i}
                className="rounded px-2.5 py-1 transition-colors"
                style={{
                  fontSize: 12,
                  color: p === 1 ? '#fff' : '#6B7280',
                  background: p === 1 ? '#1E90FF' : 'transparent',
                  border: `1px solid ${p === 1 ? '#1E90FF' : '#263D52'}`,
                  cursor: 'pointer',
                }}>
                {p}
              </button>
            ))}
            <button className="rounded px-2 py-1" style={{ fontSize: 12, color: '#6B7280', background: 'transparent', border: '1px solid #263D52', cursor: 'pointer' }}>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, value, label, badge, badgeColor, badgeDir, pulse }: {
  icon: ReactNode;
  value: string;
  label: string;
  badge: string;
  badgeColor: string;
  badgeDir: 'up' | 'neutral' | 'alert';
  pulse?: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-3" style={{
      background: '#1A2B3C',
      border: '1px solid #263D52',
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-lg" style={{
          width: 40, height: 40,
          background: 'rgba(30,144,255,0.1)',
          border: '1px solid rgba(30,144,255,0.2)',
        }}>
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 ${pulse ? 'pulse-red' : ''}`}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: badgeColor,
            background: `${badgeColor}20`,
            border: `1px solid ${badgeColor}40`,
          }}
        >
          {badgeDir === 'up' ? '↑ ' : badgeDir === 'alert' ? '● ' : ''}{badge}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function StatPill({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 10, color: '#8899AA' }}>{label}:</span>
      <span style={{ fontSize: 10, color: '#E2EAF0', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 10, color: '#6B7280' }}>{label}</span>
    </div>
  );
}
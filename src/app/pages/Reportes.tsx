import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, Calendar, ChevronDown, Car, PersonStanding, BarChart3, TriangleAlert } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const barData = [
  { dia: 'Lun', vehiculos: 1205, peatones: 321 },
  { dia: 'Mar', vehiculos: 1432, peatones: 378 },
  { dia: 'Mié', vehiculos: 1318, peatones: 352 },
  { dia: 'Jue', vehiculos: 1687, peatones: 421 },
  { dia: 'Vie', vehiculos: 1543, peatones: 389 },
  { dia: 'Sáb', vehiculos: 1421, peatones: 362 },
  { dia: 'Dom', vehiculos: 826, peatones: 211 },
];

const pieData = [
  { name: 'Automóviles', value: 62, color: '#1E90FF' },
  { name: 'Camiones', value: 18, color: '#F59E0B' },
  { name: 'Autobuses', value: 12, color: '#22C55E' },
  { name: 'Motocicletas', value: 8, color: '#A855F7' },
];

const hourlyData = Array.from({ length: 24 }, (_, h) => {
  let base = 20;
  if (h >= 7 && h <= 9) base = 80 + (h === 8 ? 120 : 90);
  else if (h >= 11 && h <= 14) base = 65 + Math.random() * 20;
  else if (h >= 17 && h <= 19) base = 90 + (h === 18 ? 110 : 85);
  else if (h >= 22 || h <= 5) base = 10 + Math.random() * 10;
  else base = 35 + Math.random() * 20;
  return {
    hora: `${String(h).padStart(2, '0')}:00`,
    vehiculos: Math.round(base),
    peatones: Math.round(base * 0.28),
  };
});

const tableData = [
  { fecha: '13/03/2026', camara: 'CAM 01', horaPico: '08:15', maxVeh: 198, anomalias: 2 },
  { fecha: '12/03/2026', camara: 'CAM 01', horaPico: '17:45', maxVeh: 187, anomalias: 1 },
  { fecha: '12/03/2026', camara: 'CAM 02', horaPico: '08:30', maxVeh: 172, anomalias: 3 },
  { fecha: '11/03/2026', camara: 'CAM 03', horaPico: '07:55', maxVeh: 156, anomalias: 0 },
  { fecha: '11/03/2026', camara: 'CAM 01', horaPico: '18:10', maxVeh: 193, anomalias: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A2B3C', border: '1px solid #263D52', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#8899AA', fontSize: 11, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill || p.color, display: 'inline-block' }} />
            <span style={{ color: '#E2EAF0', fontSize: 12 }}>{p.name}: <strong>{p.value}</strong></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function Reportes() {
  const { setActiveCameraName } = useAppContext();
  useEffect(() => { setActiveCameraName('Panel de Reportes — SMVI'); }, []);

  return (
    <div className="flex flex-col gap-5 p-5" style={{ color: '#E2EAF0' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>Reportes y Análisis Histórico</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range */}
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <Calendar size={13} style={{ color: '#6B7280' }} />
            <input type="date" defaultValue="2026-03-07"
              style={{ background: 'transparent', border: 'none', color: '#E2EAF0', fontSize: 12, outline: 'none', cursor: 'pointer' }} />
            <span style={{ color: '#6B7280', fontSize: 12 }}>—</span>
            <input type="date" defaultValue="2026-03-13"
              style={{ background: 'transparent', border: 'none', color: '#E2EAF0', fontSize: 12, outline: 'none', cursor: 'pointer' }} />
          </div>

          {/* Camera multi-select */}
          <div className="relative">
            <select style={{
              background: '#1A2B3C', border: '1px solid #263D52', borderRadius: 8,
              padding: '8px 32px 8px 12px', color: '#E2EAF0', fontSize: 12,
              outline: 'none', cursor: 'pointer', appearance: 'none',
            }}>
              <option>Todas las cámaras</option>
              <option>CAM 01</option>
              <option>CAM 02</option>
              <option>CAM 03</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
          </div>

          <button style={{
            background: '#1E90FF', color: '#fff', border: 'none', borderRadius: 8,
            padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <BarChart3 size={14} />
            Generar Reporte
          </button>
          <button className="flex items-center gap-2" style={{
            background: 'transparent', color: '#1E90FF', border: '1px solid #1E90FF', borderRadius: 8,
            padding: '8px 14px', fontSize: 12, cursor: 'pointer',
          }}>
            <FileText size={13} />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2" style={{
            background: 'transparent', color: '#1E90FF', border: '1px solid #1E90FF', borderRadius: 8,
            padding: '8px 14px', fontSize: 12, cursor: 'pointer',
          }}>
            <Download size={13} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={<Car size={18} style={{ color: '#1E90FF' }} />} value="8,432" label="Total Vehículos semana" change="+8.4%" changeColor="#22C55E" />
        <StatCard icon={<PersonStanding size={18} style={{ color: '#1E90FF' }} />} value="2,119" label="Total Peatones semana" change="+3.1%" changeColor="#22C55E" />
        <StatCard icon={<BarChart3 size={18} style={{ color: '#F59E0B' }} />} value="1,205 veh/día" label="Promedio diario" change="—" changeColor="#F59E0B" />
        <StatCard icon={<TriangleAlert size={18} style={{ color: '#FF3B3B' }} />} value="17" label="Anomalías registradas" change="+2 vs sem. ant." changeColor="#FF3B3B" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Bar chart */}
        <div className="rounded-xl p-5" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0', marginBottom: 16 }}>Flujo diario — últimos 7 días</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
                barCategoryGap="25%" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,61,82,0.8)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 2000]} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8899AA', paddingTop: 8 }} />
                <Bar dataKey="vehiculos" fill="#1E90FF" radius={[3, 3, 0, 0]} name="Vehículos" maxBarSize={28} />
                <Bar dataKey="peatones" fill="#F97316" radius={[3, 3, 0, 0]} name="Peatones" maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart */}
        <div className="rounded-xl p-5" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0', marginBottom: 16 }}>Composición vehicular</h3>
          <div className="flex items-center gap-6">
            <div style={{ width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, '']}
                    contentStyle={{ background: '#1A2B3C', border: '1px solid #263D52', borderRadius: 8 }}
                    labelStyle={{ color: '#8899AA', fontSize: 12 }}
                    itemStyle={{ color: '#E2EAF0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: item.color }} />
                  <div>
                    <div style={{ fontSize: 13, color: '#E2EAF0', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{item.value}% del total</div>
                  </div>
                </div>
              ))}
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid #263D52' }}>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Total clasificados</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>8,432</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 24h line chart */}
      <div className="rounded-xl p-5" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0' }}>Tendencia horaria promedio — Semana actual</h3>
          <div className="flex items-center gap-3">
            <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', fontSize: 11, color: '#F59E0B' }}>
              Pico A.M.: 08:00
            </span>
            <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.3)', fontSize: 11, color: '#FF3B3B' }}>
              Pico P.M.: 18:00
            </span>
          </div>
        </div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,61,82,0.8)" />
              <XAxis dataKey="hora" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false}
                interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8899AA', paddingTop: 8 }} />
              {/* Peak reference areas */}
              <Line type="monotone" dataKey="vehiculos" stroke="#1E90FF" strokeWidth={2}
                dot={false} name="Vehículos" />
              <Line type="monotone" dataKey="peatones" stroke="#F97316" strokeWidth={2}
                dot={false} name="Peatones" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #263D52' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF0' }}>Resumen por sesión de análisis</h3>
          <span style={{ fontSize: 12, color: '#6B7280' }}>5 registros</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#111C2B' }}>
              {['Fecha', 'Cámara', 'Hora Pico', 'Máx. Vehículos', 'Anomalías'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#111C2B' : '#1A2B3C', borderBottom: '1px solid rgba(38,61,82,0.4)' }}>
                <td style={{ padding: '10px 16px', fontSize: 12, color: '#E2EAF0', fontFamily: 'monospace' }}>{row.fecha}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span className="rounded px-2 py-0.5" style={{ fontSize: 11, background: 'rgba(30,144,255,0.1)', color: '#1E90FF', fontWeight: 500 }}>{row.camara}</span>
                </td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: '#F59E0B', fontFamily: 'monospace', fontWeight: 600 }}>{row.horaPico}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full overflow-hidden" style={{ width: 60, height: 5, background: '#0D1B2A' }}>
                      <div style={{ width: `${(row.maxVeh / 200) * 100}%`, height: '100%', background: '#1E90FF', borderRadius: 9999 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#E2EAF0', fontWeight: 600 }}>{row.maxVeh}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  {row.anomalias > 0 ? (
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 11, background: 'rgba(255,59,59,0.12)', color: '#FF3B3B', fontWeight: 600 }}>
                      {row.anomalias} anomalía{row.anomalias !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 11, background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                      Sin anomalías
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, change, changeColor }: {
  icon: ReactNode;
  value: string;
  label: string;
  change: string;
  changeColor: string;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-lg" style={{
          width: 36, height: 36,
          background: 'rgba(30,144,255,0.1)',
          border: '1px solid rgba(30,144,255,0.2)',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 11, color: changeColor, background: `${changeColor}20`, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
          {change}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}
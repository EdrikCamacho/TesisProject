import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAppContext } from '../context/AppContext';
import { Pencil, Settings2, Trash2, Plus, CheckCircle, Wifi, WifiOff, ChevronDown } from 'lucide-react';

const initialCameras = [
  { id: 'CAM 01', nombre: 'Blvd. Macario Gaxiola', ip: '192.168.1.101', puerto: 554, estado: 'Conectada' },
  { id: 'CAM 02', nombre: 'Av. Jiquilpan', ip: '192.168.1.102', puerto: 554, estado: 'Conectada' },
  { id: 'CAM 03', nombre: 'Calle Leyva', ip: '192.168.1.103', puerto: 554, estado: 'Sin señal' },
];

const roiPoints = [
  { label: 'X1, Y1', x: 120, y: 80 },
  { label: 'X2, Y2', x: 560, y: 80 },
  { label: 'X3, Y3', x: 620, y: 380 },
  { label: 'X4, Y4', x: 60, y: 380 },
];

export function Configuracion() {
  const { setActiveCameraName } = useAppContext();
  const [activeTab, setActiveTab] = useState('cameras');
  const [cameras, setCameras] = useState(initialCameras);
  const [saved, setSaved] = useState(false);
  const [velMax, setVelMax] = useState(60);
  const [tiempoMax, setTiempoMax] = useState(30);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { setActiveCameraName('Configuración — SMVI'); }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const deleteCamera = (id: string) => {
    if (window.confirm(`¿Eliminar ${id}?`)) {
      setCameras((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const tabs = [
    { id: 'cameras', label: 'Cámaras y Dispositivos' },
    { id: 'thresholds', label: 'Umbrales y Alertas' },
  ];

  return (
    <div className="flex flex-col gap-5 p-5" style={{ color: '#E2EAF0' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>Configuración del Sistema</h1>
        <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <span className="w-2 h-2 rounded-full rec-blink" style={{ background: '#22C55E' }} />
          <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 500 }}>Sistema activo</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1" style={{ background: '#111C2B', border: '1px solid #263D52', width: 'fit-content' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-lg px-5 py-2 transition-all"
            style={{
              background: activeTab === tab.id ? '#1E90FF' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#6B7280',
              border: 'none',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = '#E2EAF0'; }}
            onMouseLeave={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'cameras' ? (
        <>
          {/* Camera Table */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #263D52' }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Cámaras registradas</h3>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  {cameras.filter((c) => c.estado === 'Conectada').length} de {cameras.length} cámaras activas
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
                style={{ background: '#1E90FF', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,144,255,0.25)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1A7FE8'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1E90FF'; }}
              >
                <Plus size={14} />
                Registrar nueva cámara
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#111C2B' }}>
                  {['ID', 'Nombre / Ubicación', 'Dirección IP', 'Puerto', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cameras.map((cam, i) => (
                  <tr key={cam.id} style={{ background: i % 2 === 0 ? '#111C2B' : '#1A2B3C', borderBottom: '1px solid rgba(38,61,82,0.4)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E90FF', fontFamily: 'monospace' }}>{cam.id}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#E2EAF0' }}>{cam.nombre}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#8899AA', fontFamily: 'monospace' }}>{cam.ip}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#8899AA', fontFamily: 'monospace' }}>{cam.puerto}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="flex items-center gap-1.5 rounded-full px-3 py-1 w-fit"
                        style={{
                          background: cam.estado === 'Conectada' ? 'rgba(34,197,94,0.12)' : 'rgba(255,59,59,0.12)',
                          border: `1px solid ${cam.estado === 'Conectada' ? 'rgba(34,197,94,0.3)' : 'rgba(255,59,59,0.3)'}`,
                          color: cam.estado === 'Conectada' ? '#22C55E' : '#FF3B3B',
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                        {cam.estado === 'Conectada' ? <Wifi size={11} /> : <WifiOff size={11} />}
                        {cam.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex items-center gap-2">
                        <ActionBtn icon={<Pencil size={13} />} color="#1E90FF" title="Editar" />
                        <ActionBtn icon={<Settings2 size={13} />} color="#F59E0B" title="Configurar" />
                        <ActionBtn icon={<Trash2 size={13} />} color="#FF3B3B" title="Eliminar" onClick={() => deleteCamera(cam.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ROI & IPM Config */}
          <div className="rounded-xl p-5" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: 'rgba(30,144,255,0.1)', border: '1px solid rgba(30,144,255,0.2)' }}>
                <Settings2 size={16} style={{ color: '#1E90FF' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Configuración ROI & IPM — CAM 01</h3>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>Región de interés y transformación de perspectiva</p>
              </div>
            </div>

            {/* Camera preview with ROI/IPM overlay */}
            <div className="rounded-xl overflow-hidden relative mb-5" style={{
              paddingTop: '42%',
              background: '#080F1A',
              border: '1px solid #263D52',
            }}>
              <div className="absolute inset-0">
                {/* Background grid */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(30,144,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }} />

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 680 380" preserveAspectRatio="none">
                  {/* Road perspective */}
                  <line x1="340" y1="0" x2="0" y2="380" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="340" y1="0" x2="680" y2="380" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="340" y1="0" x2="340" y2="380" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                  {/* IPM calibration trapezoid - cyan dashed */}
                  <polygon
                    points="200,80 480,80 580,320 100,320"
                    fill="rgba(0,229,255,0.04)"
                    stroke="#00E5FF"
                    strokeWidth="1.2"
                    strokeDasharray="6,4"
                  />
                  <text x="325" y="60" fill="#00E5FF" fontSize="10" fontFamily="Inter" textAnchor="middle">IPM — Zona calibración</text>

                  {/* ROI polygon - green */}
                  <polygon
                    points={`${roiPoints[0].x},${roiPoints[0].y} ${roiPoints[1].x},${roiPoints[1].y} ${roiPoints[2].x},${roiPoints[2].y} ${roiPoints[3].x},${roiPoints[3].y}`}
                    fill="rgba(34,197,94,0.06)"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                  />
                  <text x="340" y="235" fill="#22C55E" fontSize="10" fontFamily="Inter" textAnchor="middle">ROI — Región activa</text>

                  {/* Drag handle dots */}
                  {roiPoints.map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="6" fill="#0D1B2A" stroke="#22C55E" strokeWidth="2" style={{ cursor: 'grab' }} />
                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#22C55E" />
                    </g>
                  ))}

                  {/* Counting line */}
                  <line x1="100" y1="280" x2="580" y2="280" stroke="#00E5FF" strokeWidth="1" strokeDasharray="8,4" />
                  <text x="100" y="273" fill="#00E5FF" fontSize="9" fontFamily="Inter">— Línea de conteo virtual</text>
                </svg>

                {/* Labels */}
                <div className="absolute top-2 left-3 rounded px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.6)', fontSize: 10, color: '#22C55E', fontWeight: 600 }}>
                  ROI activa
                </div>
                <div className="absolute top-2 right-3 rounded px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.6)', fontSize: 10, color: '#00E5FF' }}>
                  IPM calibrado
                </div>
              </div>
            </div>

            {/* Config inputs */}
            <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* ROI Points */}
              <div>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: '#8899AA', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Puntos ROI
                </h4>
                <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {roiPoints.map((pt, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{pt.label}</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          defaultValue={pt.x}
                          onFocus={() => setFocusedInput(`x${i}`)}
                          onBlur={() => setFocusedInput(null)}
                          style={{
                            width: '100%',
                            background: '#0D1B2A',
                            border: `1px solid ${focusedInput === `x${i}` ? '#1E90FF' : '#263D52'}`,
                            borderRadius: 6,
                            padding: '7px 10px',
                            color: '#E2EAF0',
                            fontSize: 12,
                            outline: 'none',
                            fontFamily: 'monospace',
                          }}
                        />
                        <input
                          type="number"
                          defaultValue={pt.y}
                          onFocus={() => setFocusedInput(`y${i}`)}
                          onBlur={() => setFocusedInput(null)}
                          style={{
                            width: '100%',
                            background: '#0D1B2A',
                            border: `1px solid ${focusedInput === `y${i}` ? '#1E90FF' : '#263D52'}`,
                            borderRadius: 6,
                            padding: '7px 10px',
                            color: '#E2EAF0',
                            fontSize: 12,
                            outline: 'none',
                            fontFamily: 'monospace',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thresholds */}
              <div>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: '#8899AA', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Umbrales
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>
                      Velocidad máxima permitida
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={velMax}
                        onChange={(e) => setVelMax(Number(e.target.value))}
                        onFocus={() => setFocusedInput('velMax')}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          width: 100,
                          background: '#0D1B2A',
                          border: `1px solid ${focusedInput === 'velMax' ? '#1E90FF' : '#263D52'}`,
                          borderRadius: 8,
                          padding: '9px 12px',
                          color: '#FFFFFF',
                          fontSize: 14,
                          fontWeight: 600,
                          outline: 'none',
                          boxShadow: focusedInput === 'velMax' ? '0 0 0 3px rgba(30,144,255,0.1)' : 'none',
                          fontFamily: 'monospace',
                        }}
                      />
                      <span style={{ fontSize: 13, color: '#6B7280' }}>km/h</span>
                    </div>
                    <div className="rounded overflow-hidden" style={{ height: 4, background: '#0D1B2A', marginTop: 4 }}>
                      <div style={{ width: `${(velMax / 120) * 100}%`, height: '100%', background: velMax > 80 ? '#FF3B3B' : '#1E90FF', borderRadius: 999, transition: 'all 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Rango sugerido: 40 – 100 km/h</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>
                      Tiempo máximo detenido
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tiempoMax}
                        onChange={(e) => setTiempoMax(Number(e.target.value))}
                        onFocus={() => setFocusedInput('tiempoMax')}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          width: 100,
                          background: '#0D1B2A',
                          border: `1px solid ${focusedInput === 'tiempoMax' ? '#1E90FF' : '#263D52'}`,
                          borderRadius: 8,
                          padding: '9px 12px',
                          color: '#FFFFFF',
                          fontSize: 14,
                          fontWeight: 600,
                          outline: 'none',
                          boxShadow: focusedInput === 'tiempoMax' ? '0 0 0 3px rgba(30,144,255,0.1)' : 'none',
                          fontFamily: 'monospace',
                        }}
                      />
                      <span style={{ fontSize: 13, color: '#6B7280' }}>segundos</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Mínimo recomendado: 15s</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>
                      Umbral de congestión (veh/min)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={25}
                        onFocus={() => setFocusedInput('congestion')}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          width: 100,
                          background: '#0D1B2A',
                          border: `1px solid ${focusedInput === 'congestion' ? '#1E90FF' : '#263D52'}`,
                          borderRadius: 8,
                          padding: '9px 12px',
                          color: '#FFFFFF',
                          fontSize: 14,
                          fontWeight: 600,
                          outline: 'none',
                          fontFamily: 'monospace',
                        }}
                      />
                      <span style={{ fontSize: 13, color: '#6B7280' }}>veh/min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #263D52' }}>
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 transition-all"
                style={{
                  background: saved ? '#16A34A' : '#1E90FF',
                  color: '#fff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: saved ? '0 4px 16px rgba(22,163,74,0.3)' : '0 4px 16px rgba(30,144,255,0.3)',
                  transition: 'all 0.3s',
                }}
              >
                {saved ? (
                  <>
                    <CheckCircle size={16} />
                    Configuración guardada exitosamente
                  </>
                ) : (
                  <>
                    <Settings2 size={16} />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Umbrales tab */
        <div className="rounded-xl p-5" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 20 }}>Umbrales globales del sistema</h3>
          <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[
              { label: 'Velocidad máxima general', val: 80, unit: 'km/h', key: 't1' },
              { label: 'Velocidad alerta crítica', val: 100, unit: 'km/h', key: 't2' },
              { label: 'Tiempo detenido — Advertencia', val: 30, unit: 's', key: 't3' },
              { label: 'Tiempo detenido — Alerta', val: 120, unit: 's', key: 't4' },
              { label: 'Densidad media (veh/min)', val: 20, unit: 'veh/min', key: 't5' },
              { label: 'Densidad alta (veh/min)', val: 40, unit: 'veh/min', key: 't6' },
            ].map((item) => (
              <div key={item.key} className="flex flex-col gap-2">
                <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>{item.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={item.val}
                    onFocus={() => setFocusedInput(item.key)}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      width: 100,
                      background: '#0D1B2A',
                      border: `1px solid ${focusedInput === item.key ? '#1E90FF' : '#263D52'}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 transition-all"
              style={{ background: saved ? '#16A34A' : '#1E90FF', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              {saved ? <CheckCircle size={14} /> : <Settings2 size={14} />}
              {saved ? 'Guardado' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="rounded-xl p-6 w-full max-w-md" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>Registrar nueva cámara</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'ID / Nombre', placeholder: 'CAM 04', type: 'text', key: 'm1' },
                { label: 'Ubicación', placeholder: 'Blvd. Ejemplo', type: 'text', key: 'm2' },
                { label: 'Dirección IP', placeholder: '192.168.1.104', type: 'text', key: 'm3' },
                { label: 'Puerto RTSP', placeholder: '554', type: 'number', key: 'm4' },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    onFocus={() => setFocusedInput(field.key)}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      background: '#0D1B2A',
                      border: `1px solid ${focusedInput === field.key ? '#1E90FF' : '#263D52'}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none',
                      boxShadow: focusedInput === field.key ? '0 0 0 3px rgba(30,144,255,0.1)' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}
                style={{ flex: 1, background: 'transparent', border: '1px solid #263D52', borderRadius: 8, padding: '10px', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => setShowAddModal(false)}
                style={{ flex: 1, background: '#1E90FF', border: 'none', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Registrar cámara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, color, title, onClick }: { icon: ReactNode; color: string; title: string; onClick?: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex items-center justify-center rounded-lg transition-all"
      style={{ width: 30, height: 30, background: `${color}15`, border: `1px solid ${color}30`, color, cursor: 'pointer' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}25`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}15`; }}
    >
      {icon}
    </button>
  );
}
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Pencil, Trash2, Shield, User, Users, Search, ChevronDown } from 'lucide-react';

const usersData = [
  { id: 1, name: 'García Morales, José', email: 'jgarcia@smvi.mx', role: 'Operador', status: 'Activo', lastLogin: 'Hoy 14:28', cameras: 3 },
  { id: 2, name: 'López Hernández, Ana', email: 'alopez@smvi.mx', role: 'Administrador', status: 'Activo', lastLogin: 'Hoy 09:14', cameras: 3 },
  { id: 3, name: 'Ramírez Torres, Carlos', email: 'cramirez@smvi.mx', role: 'Operador', status: 'Activo', lastLogin: 'Ayer 17:45', cameras: 2 },
  { id: 4, name: 'Mendoza Ríos, Patricia', email: 'pmendoza@smvi.mx', role: 'Técnico', status: 'Inactivo', lastLogin: '10/03/2026', cameras: 1 },
  { id: 5, name: 'Soto Beltrán, Miguel', email: 'msoto@smvi.mx', role: 'Técnico', status: 'Activo', lastLogin: 'Ayer 11:30', cameras: 3 },
];

const roleColors: Record<string, string> = {
  Administrador: '#FF3B3B',
  Operador: '#1E90FF',
  Técnico: '#F59E0B',
};

export function Usuarios() {
  const { setActiveCameraName } = useAppContext();
  const [search, setSearch] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState(usersData);

  useEffect(() => { setActiveCameraName('Gestión de Usuarios — SMVI'); }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = (id: number) => {
    if (window.confirm('¿Eliminar usuario?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5" style={{ color: '#E2EAF0' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>Gestión de Usuarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2"
          style={{ background: '#1E90FF', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,144,255,0.25)' }}
        >
          <Plus size={14} />
          Nuevo usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MiniCard label="Total usuarios" value={String(users.length)} color="#1E90FF" icon={<Users size={16} style={{ color: '#1E90FF' }} />} />
        <MiniCard label="Activos" value={String(users.filter((u) => u.status === 'Activo').length)} color="#22C55E" icon={<User size={16} style={{ color: '#22C55E' }} />} />
        <MiniCard label="Administradores" value={String(users.filter((u) => u.role === 'Administrador').length)} color="#FF3B3B" icon={<Shield size={16} style={{ color: '#FF3B3B' }} />} />
        <MiniCard label="Sesiones hoy" value="4" color="#F59E0B" icon={<User size={16} style={{ color: '#F59E0B' }} />} />
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1"
          style={{ background: '#1A2B3C', border: `1px solid ${focusedInput === 'search' ? '#1E90FF' : '#263D52'}`, maxWidth: 360 }}>
          <Search size={14} style={{ color: '#6B7280' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocusedInput('search')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Buscar usuario..."
            style={{ background: 'transparent', border: 'none', color: '#E2EAF0', fontSize: 13, outline: 'none', width: '100%' }}
          />
        </div>
        <div className="relative">
          <select style={{ background: '#1A2B3C', border: '1px solid #263D52', borderRadius: 8, padding: '8px 32px 8px 12px', color: '#E2EAF0', fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}>
            <option>Todos los roles</option>
            <option>Administrador</option>
            <option>Operador</option>
            <option>Técnico</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#111C2B' }}>
              {['Usuario', 'Correo', 'Rol', 'Cámaras', 'Último acceso', 'Estado', 'Acciones'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={user.id} style={{ background: i % 2 === 0 ? '#111C2B' : '#1A2B3C', borderBottom: '1px solid rgba(38,61,82,0.4)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: `${roleColors[user.role]}20`, border: `1px solid ${roleColors[user.role]}40` }}>
                      <User size={13} style={{ color: roleColors[user.role] }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#E2EAF0', fontWeight: 500 }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#8899AA' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 w-fit" style={{ fontSize: 11, background: `${roleColors[user.role]}20`, border: `1px solid ${roleColors[user.role]}40`, color: roleColors[user.role], fontWeight: 600 }}>
                    <Shield size={9} />
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, ci) => (
                      <div key={ci} style={{ width: 8, height: 8, borderRadius: 2, background: ci < user.cameras ? '#1E90FF' : '#263D52' }} />
                    ))}
                    <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 4 }}>{user.cameras}/3</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#8899AA', fontFamily: 'monospace' }}>{user.lastLogin}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="rounded-full px-2 py-0.5" style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: user.status === 'Activo' ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.2)',
                    color: user.status === 'Activo' ? '#22C55E' : '#6B7280',
                    border: `1px solid ${user.status === 'Activo' ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.3)'}`,
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-2">
                    <ActionBtn icon={<Pencil size={12} />} color="#1E90FF" title="Editar" />
                    <ActionBtn icon={<Trash2 size={12} />} color="#FF3B3B" title="Eliminar" onClick={() => deleteUser(user.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3" style={{ borderTop: '1px solid #263D52' }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Mostrando {filtered.length} de {users.length} usuarios</span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowModal(false)}>
          <div className="rounded-xl p-6 w-full max-w-md" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>Nuevo usuario</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Nombre completo', placeholder: 'Apellido, Nombre', type: 'text', key: 'nu1' },
                { label: 'Correo electrónico', placeholder: 'usuario@smvi.mx', type: 'email', key: 'nu2' },
                { label: 'Contraseña temporal', placeholder: '••••••••', type: 'password', key: 'nu3' },
              ].map((f) => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    onFocus={() => setFocusedInput(f.key)} onBlur={() => setFocusedInput(null)}
                    style={{ background: '#0D1B2A', border: `1px solid ${focusedInput === f.key ? '#1E90FF' : '#263D52'}`, borderRadius: 8, padding: '9px 12px', color: '#FFFFFF', fontSize: 13, outline: 'none' }} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>Rol</label>
                <div className="relative">
                  <select style={{ width: '100%', background: '#0D1B2A', border: '1px solid #263D52', borderRadius: 8, padding: '9px 32px 9px 12px', color: '#E2EAF0', fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                    <option>Operador</option>
                    <option>Técnico</option>
                    <option>Administrador</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #263D52', borderRadius: 8, padding: '10px', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: '#1E90FF', border: 'none', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Crear usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}>
      <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: `${color}15`, border: `1px solid ${color}25` }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: 11, color: '#6B7280' }}>{label}</div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, color, title, onClick }: { icon: ReactNode; color: string; title: string; onClick?: () => void }) {
  return (
    <button title={title} onClick={onClick}
      className="flex items-center justify-center rounded-lg transition-all"
      style={{ width: 28, height: 28, background: `${color}15`, border: `1px solid ${color}30`, color, cursor: 'pointer' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}25`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}15`; }}>
      {icon}
    </button>
  );
}
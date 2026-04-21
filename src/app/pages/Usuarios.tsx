import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Pencil, Trash2, Shield, User, Users, Search, ChevronDown } from 'lucide-react';

const roleColors: Record<string, string> = {
  Administrador: '#FF3B3B',
  Operador: '#1E90FF',
  Técnico: '#F59E0B',
};

interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
  activo: boolean;
  fecha_creacion: string;
  rol_nombre: string;
}

interface Role {
  id_rol: number;
  nombre: string;
}

export function Usuarios() {
  const { setActiveCameraName, token } = useAppContext();
  const [search, setSearch] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    id_rol: 0
  });

  useEffect(() => {
    setActiveCameraName('Gestión de Usuarios — SMVI');
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/usuarios?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`http://localhost:8000/roles?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const filtered = users.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.correo.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div style={{ color: '#E2EAF0', padding: '20px' }}>Cargando usuarios...</div>;
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/usuarios?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Usuario creado exitosamente');
        setShowModal(false);
        setFormData({ nombre: '', correo: '', password: '', id_rol: 0 });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.detail || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear usuario');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const updateData: any = {};
      if (formData.nombre) updateData.nombre = formData.nombre;
      if (formData.correo) updateData.correo = formData.correo;
      if (formData.id_rol) updateData.id_rol = formData.id_rol;

      const response = await fetch(`http://localhost:8000/usuarios/${editingUser.id_usuario}?token=${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        alert('Usuario actualizado exitosamente');
        setShowModal(false);
        setEditingUser(null);
        setFormData({ nombre: '', correo: '', password: '', id_rol: 0 });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.detail || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      const response = await fetch(`http://localhost:8000/usuarios/${id}?token=${token}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Usuario eliminado exitosamente');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.detail || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      password: '',
      id_rol: roles.find(r => r.nombre === user.rol_nombre)?.id_rol || 0
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ nombre: '', correo: '', password: '', id_rol: 0 });
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
        <MiniCard label="Activos" value={String(users.filter((u) => u.activo).length)} color="#22C55E" icon={<User size={16} style={{ color: '#22C55E' }} />} />
        <MiniCard label="Administradores" value={String(users.filter((u) => u.rol_nombre === 'Administrador').length)} color="#FF3B3B" icon={<Shield size={16} style={{ color: '#FF3B3B' }} />} />
        <MiniCard label="Sesiones hoy" value="0" color="#F59E0B" icon={<User size={16} style={{ color: '#F59E0B' }} />} />
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
              <tr key={user.id_usuario} style={{ background: i % 2 === 0 ? '#111C2B' : '#1A2B3C', borderBottom: '1px solid rgba(38,61,82,0.4)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: `${roleColors[user.rol_nombre]}20`, border: `1px solid ${roleColors[user.rol_nombre]}40` }}>
                      <User size={13} style={{ color: roleColors[user.rol_nombre] }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#E2EAF0', fontWeight: 500 }}>{user.nombre}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#8899AA' }}>{user.correo}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 w-fit" style={{ fontSize: 11, background: `${roleColors[user.rol_nombre]}20`, border: `1px solid ${roleColors[user.rol_nombre]}40`, color: roleColors[user.rol_nombre], fontWeight: 600 }}>
                    <Shield size={9} />
                    {user.rol_nombre}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, ci) => (
                      <div key={ci} style={{ width: 8, height: 8, borderRadius: 2, background: ci < 3 ? '#1E90FF' : '#263D52' }} />
                    ))}
                    <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 4 }}>3/3</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#8899AA', fontFamily: 'monospace' }}>{new Date(user.fecha_creacion).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="rounded-full px-2 py-0.5" style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: user.activo ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.2)',
                    color: user.activo ? '#22C55E' : '#6B7280',
                    border: `1px solid ${user.activo ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.3)'}`,
                  }}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-2">
                    <ActionBtn icon={<Pencil size={12} />} color="#1E90FF" title="Editar" onClick={() => openEditModal(user)} />
                    <ActionBtn icon={<Trash2 size={12} />} color="#FF3B3B" title="Eliminar" onClick={() => handleDeleteUser(user.id_usuario)} />
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
          onClick={closeModal}>
          <div className="rounded-xl p-6 w-full max-w-md" style={{ background: '#1A2B3C', border: '1px solid #263D52' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>
              {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Apellido, Nombre"
                  onFocus={() => setFocusedInput('nombre')}
                  onBlur={() => setFocusedInput(null)}
                  style={{ background: '#0D1B2A', border: `1px solid ${focusedInput === 'nombre' ? '#1E90FF' : '#263D52'}`, borderRadius: 8, padding: '9px 12px', color: '#FFFFFF', fontSize: 13, outline: 'none' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>Correo electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
                  placeholder="usuario@smvi.mx"
                  onFocus={() => setFocusedInput('correo')}
                  onBlur={() => setFocusedInput(null)}
                  style={{ background: '#0D1B2A', border: `1px solid ${focusedInput === 'correo' ? '#1E90FF' : '#263D52'}`, borderRadius: 8, padding: '9px 12px', color: '#FFFFFF', fontSize: 13, outline: 'none' }}
                />
              </div>
              {!editingUser && (
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>Contraseña temporal</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    style={{ background: '#0D1B2A', border: `1px solid ${focusedInput === 'password' ? '#1E90FF' : '#263D52'}`, borderRadius: 8, padding: '9px 12px', color: '#FFFFFF', fontSize: 13, outline: 'none' }}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 500 }}>Rol</label>
                <div className="relative">
                  <select
                    value={formData.id_rol}
                    onChange={(e) => setFormData(prev => ({ ...prev, id_rol: parseInt(e.target.value) }))}
                    style={{ width: '100%', background: '#0D1B2A', border: '1px solid #263D52', borderRadius: 8, padding: '9px 32px 9px 12px', color: '#E2EAF0', fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value={0} disabled>Seleccionar rol</option>
                    {roles.map(role => (
                      <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} style={{ flex: 1, background: 'transparent', border: '1px solid #263D52', borderRadius: 8, padding: '10px', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                style={{ flex: 1, background: '#1E90FF', border: 'none', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                {editingUser ? 'Actualizar usuario' : 'Crear usuario'}
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
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle, Shield, Camera } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const hasError = attempts > 0;
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('usuario', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      navigate('/app');
    } else {
      setAttempts((a) => a + 1);
    }
  } catch (error) {
    setAttempts((a) => a + 1);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0D1B2A', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(30,144,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow orb */}
      <div className="absolute pointer-events-none" style={{
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,144,255,0.08) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm" style={{ padding: '0 16px' }}>
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          {/* University logo placeholder */}
          <div className="flex items-center justify-center rounded-full mb-4"
            style={{
              width: 80, height: 80,
              background: '#1A2B3C',
              border: '2px solid #263D52',
              boxShadow: '0 0 0 4px rgba(30,144,255,0.1)',
            }}>
            <div className="flex flex-col items-center justify-center">
              <Shield size={28} style={{ color: '#1E90FF' }} />
              <span style={{ fontSize: 9, color: '#1E90FF', fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>UAS</span>
            </div>
          </div>
          <h1 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 20, textAlign: 'center', lineHeight: 1.3 }}>
            Sistema de Monitoreo<br />Vial Inteligente
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 6, textAlign: 'center' }}>
            Universidad Autónoma de Sinaloa — FIM
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl p-8" style={{
          background: '#1A2B3C',
          border: '1px solid #263D52',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,144,255,0.05)',
        }}>
          {/* Error state */}
          {hasError && (
            <div className="flex items-center gap-2.5 rounded-lg p-3 mb-5"
              style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)' }}>
              <AlertCircle size={16} style={{ color: '#FF3B3B', flexShrink: 0 }} />
              <span style={{ color: '#FF3B3B', fontSize: 13 }}>
                Credenciales incorrectas. Intento {attempts} de 3.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, fontWeight: 500, color: '#A0AEC0' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="usuario@smvi.mx"
                autoComplete="email"
                style={{
                  background: '#0D1B2A',
                  border: `1px solid ${focusedField === 'email' ? '#1E90FF' : hasError ? 'rgba(255,59,59,0.4)' : '#263D52'}`,
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(30,144,255,0.1)' : 'none',
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, fontWeight: 500, color: '#A0AEC0' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    background: '#0D1B2A',
                    border: `1px solid ${focusedField === 'password' ? '#1E90FF' : hasError ? 'rgba(255,59,59,0.4)' : '#263D52'}`,
                    borderRadius: 8,
                    padding: '10px 40px 10px 14px',
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                    width: '100%',
                    transition: 'border-color 0.2s',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(30,144,255,0.1)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#1E90FF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg transition-all"
              style={{
                background: loading ? '#1565CC' : '#1E90FF',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 14,
                padding: '12px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
                boxShadow: loading ? 'none' : '0 4px 16px rgba(30,144,255,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#1A7FE8';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#1E90FF';
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <p style={{ fontSize: 11, color: '#4A5568', textAlign: 'center', marginTop: 20 }}>
            Demo: admin@smvi.mx / admin123
          </p>
        </div>

        {/* Version */}
        <p style={{ color: '#4A5568', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
          v1.0 — Los Mochis, Sinaloa
        </p>

        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Camera size={12} style={{ color: '#263D52' }} />
          <span style={{ fontSize: 10, color: '#263D52' }}>YOLO v9 + ByteTrack — Sistema activo</span>
        </div>
      </div>
    </div>
  );
}

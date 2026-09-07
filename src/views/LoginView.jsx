import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '../assets/Logo';

export default function LoginView({ onLogin, loginError, loggingIn }) {
  const [email, setEmail] = useState('admin@backtoowner.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A1931 0%, #164584 100%)',
        padding: '20px'
      }}
    >
      <div
        className="bto-card animate-scale-up"
        style={{ width: '100%', maxWidth: '420px', padding: '36px 32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <Logo size="sm" theme="light" showTagline={false} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0077EE', fontWeight: 700, fontSize: '13px' }}>
            <ShieldCheck size={16} />
            <span>Admin Dashboard Sign In</span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '6px' }}>
            Sign in with your BackToOwner admin credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="email"
                className="form-input"
                placeholder="admin@backtoowner.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '36px' }}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          {loginError && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2',
                border: '1px solid #FECACA', color: '#991B1B', borderRadius: '10px',
                padding: '10px 12px', fontSize: '12.5px', marginBottom: '16px'
              }}
            >
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loggingIn}
            style={{ width: '100%', padding: '11px', fontSize: '14px', marginTop: '4px' }}
          >
            {loggingIn ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            <span>{loggingIn ? 'Signing in…' : 'Sign In'}</span>
          </button>
        </form>

        <p style={{ fontSize: '11.5px', color: '#94A3B8', textAlign: 'center', marginTop: '20px' }}>
          Default seeded admin: admin@backtoowner.com / Admin@12345
        </p>
      </div>
    </div>
  );
}

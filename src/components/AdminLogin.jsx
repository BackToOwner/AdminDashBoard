import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Invalid email or password'
        );
      }

      const { token, admin } = result.data;

      // Store JWT for authenticated API requests
      localStorage.setItem('adminToken', token);
      localStorage.setItem(
        'adminUser',
        JSON.stringify(admin)
      );

      onLogin(admin);
    } catch (err) {
      console.error('Login failed:', err);

      setError(
        err.message || 'Unable to connect to the backend'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '16px',
          background: '#ffffff',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}
      >
        <h1 style={{ marginBottom: '8px' }}>
          BackToOwner
        </h1>

        <p style={{ marginBottom: '28px' }}>
          Admin Dashboard
        </p>

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              borderRadius: '8px',
              background: '#fee2e2',
              color: '#b91c1c',
            }}
          >
            {error}
          </div>
        )}

        <label
          style={{
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '18px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            boxSizing: 'border-box',
          }}
        />

        <label
          style={{
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '24px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            boxSizing: 'border-box',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}


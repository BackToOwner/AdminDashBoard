import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function UsersView() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      setError('Please log in as an administrator.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/users?search=${encodeURIComponent(search)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load registered users.');
      }

      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Users directory error:', err);
      setError(err.message || 'Unable to connect to the backend.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role, user.id].some((value) =>
        String(value || '').toLowerCase().includes(term)
      )
    );
  }, [users, search]);

  const formatDate = (value) => {
    if (!value) return 'Unknown';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
  };

  const displayValue = (value) =>
    value === null || value === undefined || value === '' ? '—' : value;

  const statusStyle = (status) => {
    if (status === 'banned' || status === 'suspended') {
      return { background: '#FEF2F2', color: '#DC2626' };
    }
    return { background: '#ECFDF5', color: '#059669' };
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
            Users & Finders Directory
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Registered accounts from Supabase Auth
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="form-input"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: loading ? 'wait' : 'pointer' }}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div className="bto-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search
            size={15}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, role, or ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ paddingLeft: '36px', height: '38px', borderRadius: 'var(--radius-pill)' }}
          />
        </div>
      </div>

      {error && (
        <div role="alert" style={{ padding: '14px 18px', marginBottom: '16px', borderRadius: '10px', background: '#FEF2F2', color: '#B91C1C' }}>
          {error}
          <button
            type="button"
            onClick={fetchUsers}
            style={{ marginLeft: '12px', textDecoration: 'underline', background: 'none', border: 0, cursor: 'pointer', color: 'inherit' }}
          >
            Try again
          </button>
        </div>
      )}

      <div className="bto-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#FAFBFD', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px' }}>User / Member</th>
              <th style={{ padding: '16px 20px' }}>Role</th>
              <th style={{ padding: '16px 20px' }}>Contact</th>
              <th style={{ padding: '16px 20px' }}>Items Reported</th>
              <th style={{ padding: '16px 20px' }}>Items Found</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px 20px', textAlign: 'center', color: '#64748B' }}>
                  Loading registered accounts…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px 20px', textAlign: 'center', color: '#64748B' }}>
                  Could not load accounts.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px 20px', textAlign: 'center', color: '#64748B' }}>
                  {search ? 'No accounts match your search.' : 'No registered accounts were returned by Supabase Auth.'}
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const status = user.status || 'active';

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            referrerPolicy="no-referrer"
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00D2B4' }}
                          />
                        ) : (
                          <div aria-hidden="true" style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', color: '#475569', fontWeight: 700 }}>
                            {(user.name || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{user.name || 'Unnamed user'}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                            {user.id} · Joined {formatDate(user.joinedAt)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 600 }}>
                      {user.role || 'user'}
                    </td>

                    <td style={{ padding: '14px 20px', color: '#475569' }}>
                      <div>{user.email || '—'}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user.phone || '—'}</div>
                    </td>

                    <td style={{ padding: '14px 20px', fontWeight: 700 }}>
                      {displayValue(user.itemsReported)}
                    </td>

                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#059669' }}>
                      {displayValue(user.itemsFound)}
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', ...statusStyle(status), fontSize: '11.5px', fontWeight: 700 }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && (
        <p style={{ fontSize: '12px', color: '#64748B', marginTop: '12px' }}>
          Showing {filtered.length} registered account{filtered.length === 1 ? '' : 's'}.
          Item counts and trust scores remain unavailable until real activity data is connected.
        </p>
      )}
    </div>
  );
}

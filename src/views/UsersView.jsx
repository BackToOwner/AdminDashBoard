import React, { useState } from 'react';
import { Users, ShieldCheck, Search, Award, Star, Mail, Phone, CheckCircle } from 'lucide-react';
import { mockUsers } from '../data/mockData';

export default function UsersView() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Users & Finders Directory</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Manage registered mobile app users, verified finders, trust scores, and transit partners
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bto-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by name, email, or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', borderRadius: 'var(--radius-pill)' }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bto-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#FAFBFD', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px' }}>User / Member</th>
              <th style={{ padding: '16px 20px' }}>Role</th>
              <th style={{ padding: '16px 20px' }}>Contact</th>
              <th style={{ padding: '16px 20px' }}>Items Reported</th>
              <th style={{ padding: '16px 20px' }}>Items Found</th>
              <th style={{ padding: '16px 20px' }}>Trust Score</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00D2B4' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user.id} • Joined {user.joined}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                    {user.role}
                  </span>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <div>{user.email}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user.phone}</div>
                  </div>
                </td>

                <td style={{ padding: '14px 20px', fontWeight: 700 }}>
                  {user.itemsReported}
                </td>

                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#059669' }}>
                  {user.itemsFound}
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '60px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${user.trustScore}%`, height: '100%', background: '#00D2B4' }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{user.trustScore}%</span>
                  </div>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#ECFDF5', color: '#059669', fontSize: '11.5px', fontWeight: 700 }}>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

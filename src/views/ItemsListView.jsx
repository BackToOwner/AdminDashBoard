import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Grid, 
  List, 
  MapPin, 
  Clock, 
  Sparkles, 
  Eye, 
  ShieldCheck,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export default function ItemsListView({ 
  items, 
  categories = [],
  onSelectItem,
  initialType = 'all',
  resetFiltersKey = 0
}) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sync the type filter when navigation changes (e.g. See all).
  React.useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  React.useEffect(() => {
    setSearch('');
    setSelectedType(initialType);
    setSelectedCategory('all');
    setSelectedStatus('all');
  }, [resetFiltersKey, initialType]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      (item.reporter && item.reporter.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.finder && item.finder.name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesType && matchesCat && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['ID,Title,Type,Category,Status,Location,Reward,Reporter/Finder,Date\n'];
    const rows = filteredItems.map(i => {
      const user = i.reporter ? i.reporter.name : i.finder ? i.finder.name : 'N/A';
      return `"${i.id}","${i.title}","${i.type}","${i.category}","${i.status}","${i.location}","${i.reward || 0}","${user}","${i.date || ''}"\n`;
    });
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtoowner-user-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in">
      {/* Page Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Lost & Found Reports</h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 210, 180, 0.12)', color: '#00A896', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
              <Smartphone size={12} />
              Mobile User Uploads
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Monitoring and verifying all cases uploaded by registered mobile app users and finders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={exportCSV} style={{ fontSize: '13px', gap: '6px' }}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bto-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by item title, case ID, location, user or finder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          {/* Type Filter */}
          <div className="filter-tabs-pills">
            {['all', 'lost', 'found'].map(typeKey => (
              <button
                key={typeKey}
                className={`filter-tab-pill-btn ${selectedType === typeKey ? 'active' : ''}`}
                onClick={() => setSelectedType(typeKey)}
                style={{ textTransform: 'capitalize' }}
              >
                {typeKey === 'all' ? 'All Uploads' : typeKey === 'lost' ? '💛 Lost Reports' : '💙 Found Reports'}
              </button>
            ))}
          </div>

          {/* Dynamic Category Dropdown */}
          <select 
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', height: '38px', padding: '0 12px', borderRadius: 'var(--radius-md)' }}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select 
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: 'auto', height: '38px', padding: '0 12px', borderRadius: 'var(--radius-md)' }}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Cases</option>
            <option value="in_review">In Review</option>
            <option value="matched">Matched</option>
            <option value="returned">Returned</option>
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
            <button 
              onClick={() => setViewMode('table')}
              style={{ padding: '6px 10px', borderRadius: '6px', background: viewMode === 'table' ? '#FFFFFF' : 'transparent', color: viewMode === 'table' ? '#0A1931' : '#64748B' }}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ padding: '6px 10px', borderRadius: '6px', background: viewMode === 'grid' ? '#FFFFFF' : 'transparent', color: viewMode === 'grid' ? '#0A1931' : '#64748B' }}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Item Display - Table View */}
      {viewMode === 'table' ? (
        <div className="bto-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#FAFBFD', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Item & Title</th>
                <th style={{ padding: '16px 20px' }}>Case Type</th>
                <th style={{ padding: '16px 20px' }}>Location</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Uploaded By (User / Finder)</th>
                <th style={{ padding: '16px 20px' }}>Reward</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease', cursor: 'pointer' }}
                  onClick={() => onSelectItem(item)}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={item.images ? item.images[0] : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=80'} 
                        alt={item.title} 
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{item.id} • {item.date || item.timeAgo}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                      {item.type}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '13px' }}>
                      <MapPin size={13} color="#0077EE" />
                      <span>{item.location}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge-status status-${item.status}`}>
                      ● {item.status.replace('_', ' ')}
                    </span>
                    {item.matched && (
                      <span className="badge-matched" style={{ marginLeft: '6px' }}>
                        MATCHED
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                      {item.reporter ? item.reporter.name : item.finder ? item.finder.name : 'Unknown'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#00A896', fontWeight: 600 }}>
                      {item.reporter ? '📱 App User (Owner)' : '🔍 Verified Finder'}
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {item.reward ? (
                      <span className="badge-reward">LKR ${item.reward}</span>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>—</span>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button 
                      className="btn-secondary"
                      onClick={(e) => { e.stopPropagation(); onSelectItem(item); }}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bto-card" 
              style={{ padding: '16px', cursor: 'pointer' }}
              onClick={() => onSelectItem(item)}
            >
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img 
                  src={item.images ? item.images[0] : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80'} 
                  alt={item.title} 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} 
                />
                <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  {item.type}
                </span>
                {item.reward && (
                  <span className="badge-reward" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    LKR ${item.reward} reward
                  </span>
                )}
              </div>

              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                <MapPin size={12} color="#0077EE" />
                <span>{item.location}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '12px' }}>
                <span className={`badge-status status-${item.status}`}>● {item.status.replace('_', ' ')}</span>
                <span style={{ color: '#00A896', fontWeight: 600 }}>{item.reporter ? item.reporter.name : item.finder?.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

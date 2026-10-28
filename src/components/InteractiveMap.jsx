import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Navigation, 
  ExternalLink, 
  Eye, 
  Sparkles,
  Info
} from 'lucide-react';
import '../styles/map.css';

export default function InteractiveMap({ 
  items = [], 
  onSelectItem, 
  onViewFullMap,
  isFullView = false 
}) {
  const [selectedRadius, setSelectedRadius] = useState(2.5); // in km
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePin, setActivePin] = useState(null);

  // Filter items within radius
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRadius = (item.distanceKm || 1.0) <= selectedRadius;
    return matchesCategory && matchesRadius;
  });

  // Calculate simulated relative positions on the radar grid based on index/coordinates
  const getPinPosition = (item, index) => {
    // Deterministic position inside circle based on item coordinates / distance
    const angle = (index * 68) * (Math.PI / 180);
    const normalizedDist = Math.min((item.distanceKm || 1.0) / selectedRadius, 0.85);
    const radiusPx = normalizedDist * (isFullView ? 240 : 120);
    
    const x = 50 + (Math.cos(angle) * (radiusPx / (isFullView ? 600 : 320)) * 100);
    const y = 50 + (Math.sin(angle) * (radiusPx / (isFullView ? 360 : 200)) * 100);

    return { top: `${Math.max(12, Math.min(88, y))}%`, left: `${Math.max(10, Math.min(90, x))}%` };
  };

  const getPinColorClass = (item) => {
    if (item.category === 'pets') return 'pin-dot-pet';
    if (item.matched) return 'pin-dot-matched';
    if (item.type === 'lost') return 'pin-dot-lost';
    return 'pin-dot-found';
  };

  return (
    <div className="bto-card" style={{ padding: '20px', position: 'relative' }}>
      {/* Map Header */}
      <div className="card-header-clean" style={{ marginBottom: '14px' }}>
        <div>
          <div className="card-title">
            <MapPin size={20} color="#0077EE" />
            <span>Nearby Items Radar</span>
          </div>
          <div className="card-subtitle">Real-time GPS proximity tracking around Central Hub</div>
        </div>

        {/* View Map Link matching mobile screen "View Map ->" */}
        {onViewFullMap && !isFullView && (
          <button 
            className="btn-secondary"
            onClick={onViewFullMap}
            style={{ padding: '6px 12px', fontSize: '12.5px', color: '#0077EE', fontWeight: 700, gap: '4px' }}
          >
            <span>View Full Map</span>
            <ExternalLink size={13} />
          </button>
        )}
      </div>

      {/* Radar Map Container */}
      <div className="radar-map-container" style={{ height: isFullView ? '580px' : '310px' }}>
        <div className="map-grid-overlay" />

        {/* Radar Concentric Rings */}
        <div className="radar-ring ring-1" style={isFullView ? { width: '220px', height: '220px' } : {}} />
        <div className="radar-ring ring-2" style={isFullView ? { width: '440px', height: '440px' } : {}} />
        <div className="radar-ring ring-3" style={isFullView ? { width: '660px', height: '660px' } : {}} />

        {/* Center Point (Current Admin Location) */}
        <div className="radar-center-point" title="Your Current Location (Central Hub)" />

        {/* Radar Sweep Animation Beam */}
        <div className="radar-sweep-beam" style={isFullView ? { width: '340px', height: '340px' } : {}} />

        {/* Dynamic Interactive Pin Markers */}
        {filteredItems.map((item, idx) => {
          const pos = getPinPosition(item, idx);
          const isSelected = activePin?.id === item.id;

          return (
            <div
              key={item.id}
              className="map-pin-marker"
              style={{ top: pos.top, left: pos.left }}
              onClick={() => setActivePin(isSelected ? null : item)}
              onMouseEnter={() => setActivePin(item)}
            >
              <div className={`pin-dot ${getPinColorClass(item)}`} />

              {/* Popup on Pin Hover / Click */}
              {isSelected && (
                <div className="map-pin-popup" onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                      {item.type}
                    </span>
                    {item.reward && (
                      <span className="badge-reward">LKR {item.reward} reward</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A', marginBottom: '3px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '8px' }}>
                    <MapPin size={11} />
                    <span>{item.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '10.5px', color: '#0077EE', fontWeight: 700 }}>
                      📍 {item.distanceKm || 0.8} km away
                    </span>
                    <button 
                      onClick={() => onSelectItem(item)}
                      style={{ padding: '3px 8px', background: '#0A1931', color: '#FFFFFF', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Map Radius Controls Overlay */}
        <div className="map-controls-overlay">
          <select 
            className="map-radius-selector"
            value={selectedRadius}
            onChange={(e) => setSelectedRadius(parseFloat(e.target.value))}
          >
            <option value="1">Radar: 1 km radius</option>
            <option value="2.5">Radar: 2.5 km radius</option>
            <option value="5">Radar: 5 km radius</option>
            <option value="15">Radar: 15 km radius</option>
          </select>
        </div>

        {/* Floating status pill matching "📍 3 items within 1km" from screenshot */}
        <div className="map-status-pill-badge">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D2B4', display: 'inline-block', boxShadow: '0 0 6px #00D2B4' }}></span>
          <span>{filteredItems.length} items within {selectedRadius}km</span>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: '#64748B' }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#FF5252' }}></span> Lost Items
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }}></span> Found Items
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#00D2B4' }}></span> Matched Cases
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Click any pin for fast inspection</span>
      </div>
    </div>
  );
}

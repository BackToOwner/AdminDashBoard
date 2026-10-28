import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

export default function LiveMapView({ items, onSelectItem }) {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Live Hotspot Radar Map</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Real-time geolocation tracking, proximity cluster analysis, and geofence alerts
          </p>
        </div>
</div>

      <InteractiveMap 
        items={items} 
        onSelectItem={onSelectItem} 
        isFullView={true} 
      />
    </div>
  );
}

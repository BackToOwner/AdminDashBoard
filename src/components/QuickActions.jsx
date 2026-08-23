import React from 'react';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';

export default function QuickActions({ onFilterType, lostCount = 1840, foundCount = 1451 }) {
  return (
    <div className="quick-actions-row">
      {/* 1. Lost Items Uploaded by Mobile Users (Coral Card) */}
      <div 
        className="quick-action-card quick-action-lost"
        onClick={() => onFilterType && onFilterType('lost')}
      >
        <div>
          <div className="action-card-emoji">🥺</div>
          <div className="action-card-title">Lost Items Feed</div>
          <div className="action-card-desc">Uploaded by mobile app users • Active search cases</div>
        </div>

        <div className="action-card-btn-pill">
          <span>View Lost Feed ({lostCount.toLocaleString()})</span>
          <ArrowRight size={15} />
        </div>
      </div>

      {/* 2. Found Items Uploaded by Finders (Emerald Card) */}
      <div 
        className="quick-action-card quick-action-found"
        onClick={() => onFilterType && onFilterType('found')}
      >
        <div>
          <div className="action-card-emoji">🎉</div>
          <div className="action-card-title">Found Items Feed</div>
          <div className="action-card-desc">Turned in by finders & transit officers • Ready to claim</div>
        </div>

        <div className="action-card-btn-pill">
          <span>View Found Feed ({foundCount.toLocaleString()})</span>
          <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
}

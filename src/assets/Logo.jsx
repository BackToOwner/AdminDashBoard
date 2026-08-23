import React from 'react';

export default function Logo({ 
  size = 'md', // 'sm', 'md', 'lg', 'icon-only'
  theme = 'light', // 'light' (for light backgrounds), 'dark' (for dark/navy backgrounds)
  showTagline = true,
  className = '' 
}) {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0B1B3D';
  const tagColor = isDark ? '#94A3B8' : '#64748B';
  const lineColor = isDark ? '#334155' : '#CBD5E1';

  // Dimension presets
  const dimensions = {
    sm: { iconSize: 32, fontSize: 18, tagSize: 9, height: 38 },
    md: { iconSize: 42, fontSize: 22, tagSize: 11, height: 48 },
    lg: { iconSize: 64, fontSize: 32, tagSize: 13, height: 72 },
    'icon-only': { iconSize: 42, fontSize: 0, tagSize: 0, height: 42 }
  }[size] || { iconSize: 42, fontSize: 22, tagSize: 11, height: 48 };

  if (size === 'icon-only') {
    return (
      <svg 
        width={dimensions.iconSize} 
        height={dimensions.iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        className={className}
      >
        <defs>
          <linearGradient id="logoBlueGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A3FF" />
            <stop offset="50%" stopColor="#0D59A7" />
            <stop offset="100%" stopColor="#0B2050" />
          </linearGradient>
          <linearGradient id="logoTealGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5BE" />
            <stop offset="100%" stopColor="#00A896" />
          </linearGradient>
          <filter id="glowIcon" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00A3FF" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#glowIcon)">
          {/* Main Stylized 'B' Shape */}
          <path 
            d="M 22 8 L 62 8 C 78 8 90 19 90 33 C 90 42 84 49 76 52 C 87 56 94 65 94 77 C 94 92 80 102 62 102 L 22 102 Z" 
            fill="url(#logoBlueGradIcon)" 
          />
          {/* Upper Cutout */}
          <path 
            d="M 40 24 L 58 24 C 65 24 71 28 71 35 C 71 42 65 46 58 46 L 40 46 Z" 
            fill={isDark ? "#0A1931" : "#FFFFFF"} 
          />
          {/* Lower Cutout */}
          <path 
            d="M 40 60 L 60 60 C 68 60 74 65 74 74 C 74 83 68 88 59 88 L 40 88 Z" 
            fill={isDark ? "#0A1931" : "#FFFFFF"} 
          />

          {/* Location Pin */}
          <path 
            d="M 50 18 C 44 18 39 23 39 29 C 39 37 50 46 50 46 C 50 46 61 37 61 29 C 61 23 56 18 50 18 Z" 
            fill="#0A2558"
          />
          <circle cx="50" cy="28" r="3.5" fill="#FFFFFF" />

          {/* Teal Bag */}
          <rect x="39" y="42" width="22" height="19" rx="4" fill="url(#logoTealGradIcon)" />
          <path 
            d="M 45 42 C 45 37 55 37 55 42" 
            stroke="#00E5BE" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* Tag */}
          <path d="M 54 46 L 57 46 L 58 51 L 55 51 Z" fill="#FFFFFF" opacity="0.9" />

          {/* White Hand holding/supporting */}
          <path 
            d="M 31 66 C 35 60 44 61 50 61 C 59 61 66 59 70 54 C 70 60 64 65 57 67 C 50 68 42 68 37 72 C 34 74 30 79 26 84 C 28 78 29 70 31 66 Z" 
            fill="#FFFFFF" 
          />
        </g>
      </svg>
    );
  }

  return (
    <div className={`logo-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
      {/* SVG Icon */}
      <svg 
        width={dimensions.iconSize} 
        height={dimensions.iconSize} 
        viewBox="0 0 100 100" 
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={`logoBlueGrad_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A3FF" />
            <stop offset="50%" stopColor="#0D59A7" />
            <stop offset="100%" stopColor="#0B2050" />
          </linearGradient>
          <linearGradient id={`logoTealGrad_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5BE" />
            <stop offset="100%" stopColor="#00A896" />
          </linearGradient>
        </defs>

        {/* Main Stylized 'B' Shape */}
        <path 
          d="M 22 8 L 62 8 C 78 8 90 19 90 33 C 90 42 84 49 76 52 C 87 56 94 65 94 77 C 94 92 80 102 62 102 L 22 102 Z" 
          fill={`url(#logoBlueGrad_${size})`} 
        />
        {/* Upper Cutout */}
        <path 
          d="M 40 24 L 58 24 C 65 24 71 28 71 35 C 71 42 65 46 58 46 L 40 46 Z" 
          fill={isDark ? "#0A1931" : "#FFFFFF"} 
        />
        {/* Lower Cutout */}
        <path 
          d="M 40 60 L 60 60 C 68 60 74 65 74 74 C 74 83 68 88 59 88 L 40 88 Z" 
          fill={isDark ? "#0A1931" : "#FFFFFF"} 
        />

        {/* Location Pin */}
        <path 
          d="M 50 18 C 44 18 39 23 39 29 C 39 37 50 46 50 46 C 50 46 61 37 61 29 C 61 23 56 18 50 18 Z" 
          fill="#0A2558"
        />
        <circle cx="50" cy="28" r="3.5" fill="#FFFFFF" />

        {/* Teal Bag */}
        <rect x="39" y="42" width="22" height="19" rx="4" fill={`url(#logoTealGrad_${size})`} />
        <path 
          d="M 45 42 C 45 37 55 37 55 42" 
          stroke="#00E5BE" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round" 
        />
        {/* Tag */}
        <path d="M 54 46 L 57 46 L 58 51 L 55 51 Z" fill="#FFFFFF" opacity="0.9" />

        {/* White Hand */}
        <path 
          d="M 31 66 C 35 60 44 61 50 61 C 59 61 66 59 70 54 C 70 60 64 65 57 67 C 50 68 42 68 37 72 C 34 74 30 79 26 84 C 28 78 29 70 31 66 Z" 
          fill="#FFFFFF" 
        />
      </svg>

      {/* Typography Brand Name */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ 
          fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", 
          fontSize: `${dimensions.fontSize}px`, 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          lineHeight: 1.1,
          color: textColor 
        }}>
          Back<span style={{ color: '#00D2B4', fontWeight: 800 }}>To</span>Owner
        </div>

        {showTagline && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            marginTop: '3px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: `${dimensions.tagSize}px`,
            fontWeight: 500,
            color: tagColor,
            letterSpacing: '0.02em'
          }}>
            <span style={{ width: '12px', height: '1px', backgroundColor: lineColor, display: 'inline-block' }}></span>
            <span>Lost Today, Found Tomorrow</span>
            <span style={{ width: '12px', height: '1px', backgroundColor: lineColor, display: 'inline-block' }}></span>
          </div>
        )}
      </div>
    </div>
  );
}

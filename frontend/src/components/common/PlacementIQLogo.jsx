import React from 'react';

/**
 * PlacementIQLogo — Theme-aware SVG icon for PlacementIQ.
 * Concept: Neural network node (brain/AI) merged with upward-trending career arrow.
 *
 * Props:
 *   size       — icon width/height in px (default 36)
 *   className  — extra Tailwind / CSS classes on the wrapper
 */
const PlacementIQLogo = ({ size = 36, className = '' }) => (
  <div
    className={className}
    style={{ width: size, height: size, flexShrink: 0 }}
  >
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <defs>
        {/* Main gradient: electric-blue → cyan */}
        <linearGradient id="piq-grad-main" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5865F2" />
          <stop offset="55%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="piq-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Rounded-square clip */}
        <clipPath id="piq-clip">
          <rect x="0" y="0" width="48" height="48" rx="12" ry="12" />
        </clipPath>
      </defs>

      {/* Background rounded square */}
      <rect x="0" y="0" width="48" height="48" rx="12" ry="12" fill="url(#piq-grad-main)" />

      {/* ── Neural graph nodes + upward arrow ── */}
      {/* Arrow shaft (upward trend) */}
      <polyline
        points="8,36 20,22 28,28 40,12"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#piq-glow)"
        opacity="0.95"
      />

      {/* Arrowhead */}
      <polyline
        points="33,10 40,12 38,19"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />

      {/* Neural nodes (circles at key waypoints) */}
      <circle cx="8"  cy="36" r="3" fill="white" opacity="0.95" />
      <circle cx="20" cy="22" r="3" fill="white" opacity="0.95" />
      <circle cx="28" cy="28" r="3" fill="white" opacity="0.95" />
      <circle cx="40" cy="12" r="3.5" fill="white" filter="url(#piq-glow)" opacity="1" />

      {/* Subtle network connection lines */}
      <line x1="8"  y1="36" x2="20" y2="22" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="20" y1="22" x2="28" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="28" y1="28" x2="40" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

      {/* Extra side neural branches */}
      <line x1="20" y1="22" x2="14" y2="14" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="14" cy="14" r="2" fill="rgba(255,255,255,0.5)" />

      <line x1="28" y1="28" x2="36" y2="34" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="36" cy="34" r="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  </div>
);

export default PlacementIQLogo;


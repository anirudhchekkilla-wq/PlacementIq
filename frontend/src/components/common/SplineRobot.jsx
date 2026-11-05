import React, { useState } from 'react';
import { FiCpu } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

/**
 * SplineRobot — Floating 3D interactive robot seamlessly integrated into the page background.
 * No separate card frame or box background: uses the entire page's animated background.
 */
const SplineRobot = ({
  className = '',
  height = '560px',
  ambientGlow = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden bg-transparent ${className}`}
      style={{ minHeight: height, height }}
    >
      {/* Soft Ambient Radial Glow Seamlessly Radiating into the Page Background */}
      {ambientGlow && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div
            className={`w-[110%] h-[110%] rounded-full blur-[100px] animate-pulse pointer-events-none bg-gradient-to-tr ${
              isDark
                ? 'from-[#5865F2]/25 via-[#A855F7]/20 to-[#00E5FF]/25'
                : 'from-[#5865F2]/10 via-[#A855F7]/08 to-[#00E5FF]/12'
            }`}
          />
        </div>
      )}

      {/* Loading Skeleton / Fallback State — completely transparent backdrop */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-transparent">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#5865F2] to-[#00E5FF] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,229,255,0.4)] animate-bounce">
            <FiCpu size={32} />
          </div>
          <span
            className={`text-xs font-semibold uppercase tracking-widest animate-pulse ${
              isDark ? 'text-[#00E5FF]' : 'text-[#5865F2]'
            }`}
          >
            Connecting 3D Neural Avatar...
          </span>
        </div>
      )}

      {/* Spline 3D Scene Iframe — transparent background with watermark overflow clipped */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center z-10">
        <iframe
          src="https://my.spline.design/genkubgreetingrobotcopy-BqFLHkDhOLV3K3NHDoOuXnFW/"
          title="Spline 3D Greeting Robot"
          allow="autoplay; fullscreen"
          allowTransparency="true"
          className={`w-full relative border-0 transition-opacity duration-700 pointer-events-auto ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            height: 'calc(100% + 55px)',
            marginBottom: '-55px',
            background: 'transparent',
            colorScheme: isDark ? 'dark' : 'light',
          }}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default SplineRobot;

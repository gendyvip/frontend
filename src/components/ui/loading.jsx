import React, { useEffect, useState } from 'react';



export const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
      {/* Modern capsule-themed spinner */}
      <div className="relative">
        <div className="w-20 h-10 rounded-full border-3 border-transparent border-t-gray-400 border-r-gray-500 animate-spin shadow-lg bg-gradient-to-r from-gray-50 to-gray-100"></div>
        
        {/* Inner capsule with modern styling */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse border-2 border-gray-300 shadow-md"></div>
        </div>
        
        {/* Modern capsule center line */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full shadow-sm"></div>
        </div>
        
        {/* Modern center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-ping shadow-md"></div>
        </div>
        
        {/* Modern glow */}
        <div className="absolute inset-0 w-20 h-10 rounded-full bg-gradient-to-r from-gray-100/40 via-transparent to-gray-100/40 animate-pulse"></div>
      </div>
      
      {/* Modern loading text */}
      <div className="text-center space-y-3">
        <p className="text-sm font-semibold text-gray-700 animate-pulse tracking-wide">
          {message}
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-1.5 h-0.75 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-bounce shadow-sm"></div>
          <div className="w-1.5 h-0.75 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-bounce delay-100 shadow-sm"></div>
          <div className="w-1.5 h-0.75 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full animate-bounce delay-200 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

// Modern inline loading with capsule theme

// Modern skeleton loading with capsule theme
export const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse shadow-inner ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};


export const PharmacyAnimatedLoader = ({ size = 80, className = "", message = "Loading..." }) => {
  // Colors: primary, secondary, accent
  const pillColors = ['#6366f1', '#FEC015', '#F32626']; // indigo-500, yellow, green
  const gradientId = 'pill-gradient';
  // Arrange 3 pills at the vertices of an equilateral triangle
  const pillCount = 3;
  const triangleRadius = size * 0.75; // reduced for less space between pills
  const center = size * 1.1;
  // Angles for triangle vertices (top, bottom left, bottom right)
  const angles = [-90, 150, 30]; // degrees
  // Rotations so each pill follows the triangle's edge at its vertex
  const rotations = [0, 120, -120];
  const icons = angles.map((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    const x = center + triangleRadius * Math.cos(rad);
    const y = center + triangleRadius * Math.sin(rad);
    const primary = pillColors[i % pillColors.length];
    return (
      <div
        key={i}
        className={`pharmacy-loader-icon pharmacy-pill-rotate-${i}`}
        style={{
          animationDelay: `${i * 0.18}s`,
          width: size,
          height: size,
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%)`
        }}
      >
        <svg className={`pharmacy-pill-svg-spin pharmacy-pill-svg-spin-${i}`} width={size} height={size} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id={gradientId + i} x1="8" y1="24" x2="56" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor={primary} />
              <stop offset="1" stopColor={primary} />
            </linearGradient>
            <linearGradient id={gradientId + '-shine-' + i} x1="20" y1="28" x2="44" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Capsule shadow */}
          <ellipse cx="32" cy="44" rx="20" ry="6" fill="#bdbdfc" opacity="0.25" />
          {/* Capsule outline */}
          <rect x="8" y="20" width="48" height="24" rx="12" fill="#fff" stroke="#bdbdfc" strokeWidth="2" />
          {/* Left half (solid, diagonal split) */}
          <clipPath id={"clip-left-" + i}>
            <polygon points="8,20 36,20 56,44 8,44" />
          </clipPath>
          <rect x="8" y="20" width="48" height="24" rx="12" fill={primary} clipPath={`url(#clip-left-${i})`} />
          {/* Shine highlight */}
          <ellipse cx="24" cy="28" rx="7" ry="3" fill={`url(#${gradientId + '-shine-' + i})`} />
        </svg>
      </div>
    );
  });
  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-full ${className}`}
      style={{ background: 'transparent', minHeight: size * 2.2, minWidth: size * 2.2 }}
    >
      <div style={{ position: 'relative', width: size * 2.2, height: size * 2.2 }}>
        {icons}
      </div>
      <div className="mt-2 text-center">
        <p className="text-md font-medium text-gray-600 animate-pulse">{message}</p>
      </div>
      <style>{`
        .pharmacy-loader-icon {
          opacity: 0.3;
          animation: pharmacyLoaderAnim 1.2s cubic-bezier(.4,0,.2,1) infinite;
          will-change: opacity, transform;
        }
        .pharmacy-loader-icon:nth-child(1) { animation-delay: 0s; }
        .pharmacy-loader-icon:nth-child(2) { animation-delay: 0.18s; }
        .pharmacy-loader-icon:nth-child(3) { animation-delay: 0.36s; }
        .pharmacy-pill-svg-spin-0 { animation: pillSpin0 1.5s linear infinite; transform-origin: 50% 50%; }
        .pharmacy-pill-svg-spin-1 { animation: pillSpin1 1.5s linear infinite; transform-origin: 50% 50%; }
        .pharmacy-pill-svg-spin-2 { animation: pillSpin2 1.5s linear infinite; transform-origin: 50% 50%; }
        @keyframes pharmacyLoaderAnim {
          0% { 
            opacity: 0.3; 
            transform: scale(0.7) translate(-50%, -50%); 
          }
          20% { 
            opacity: 1; 
            transform: scale(1.1) translate(-50%, -50%); 
          }
          40% { 
            opacity: 1; 
            transform: scale(1) translate(-50%, -50%); 
          }
          100% { 
            opacity: 0.3; 
            transform: scale(0.7) translate(-50%, -50%); 
          }
        }
        @keyframes pillSpin0 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pillSpin1 {
          0% { transform: rotate(120deg); }
          100% { transform: rotate(480deg); }
        }
        @keyframes pillSpin2 {
          0% { transform: rotate(-120deg); }
          100% { transform: rotate(240deg); }
        }
      `}</style>
    </div>
  );
}; 

export const LoadingPage = ({ message = "Loading..." })=> {
  return (
      <PharmacyAnimatedLoader message={message} size={50} />
  );
}; 
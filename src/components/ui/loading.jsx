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


// Custom loader with two SVGs: wrapper spins around capsule
export const LoadingPage = ({ size = 80, className = "", message = "Loading..." }) => {
  const wrapperSize = size * 1; // Make wrapper larger than capsule
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div style={{ position: "relative", width: wrapperSize, height: wrapperSize }}>
        {/* Spinning wrapper SVG */}
        <img
          src="/wrapper.svg"
          alt="Loader Wrapper"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: wrapperSize,
            height: wrapperSize,
            animation: "spin 1.2s linear infinite",
            transformOrigin: "50% 50%",
          }}
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-md font-medium text-gray-600 animate-pulse">{message}</p>
      </div>
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}; 
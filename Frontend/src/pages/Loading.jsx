import React, { useEffect, useState } from "react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + Math.random() * 10, 100));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80"></div>
      
      {/* Content Container */}
      <div className="z-10 flex flex-col items-center">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 tracking-tight">
            ticketa
          </h1>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-gray-400 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg md:text-xl mb-12 text-center">
          Your premium event booking platform
        </p>

        {/* Loading Bar */}
        <div className="w-full max-w-md bg-gray-800 rounded-full h-2.5 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-gray-500 to-gray-300 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <div 
                key={dot}
                className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"
                style={{ animationDelay: `${dot * 0.2}s` }}
              ></div>
            ))}
          </div>
          <p>Loading {Math.round(progress)}%</p>
        </div>
      </div>

      {/* Particles Effect - For Visual Enhancement */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-700 opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10}px`,
            height: `${Math.random() * 10}px`,
            animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
          }}
        ></div>
      ))}

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-600 text-sm z-10">
        © {new Date().getFullYear()} Ticketa. All rights reserved.
      </div>

      {/* Adding a style tag for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
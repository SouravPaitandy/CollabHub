'use client';
import React, { useState, useEffect } from 'react';
import { Code, GitBranch, MessageSquare, Video, Users, Zap, Github, CheckCircle } from 'lucide-react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Connecting workspaces');
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  // Array of loading messages to cycle through
  const loadingMessages = [
    'Connecting workspaces',
    'Loading collaboration tools',
    'Syncing GitHub repositories',
    'Preparing team environment',
    'Setting up real-time connections'
  ];
  
  // Logo animation settings
  const [activeIcon, setActiveIcon] = useState(0);
  const icons = [
    { component: <Code />, color: 'text-blue-500', label: 'Code' },
    { component: <GitBranch />, color: 'text-green-500', label: 'Branches' },
    { component: <MessageSquare />, color: 'text-purple-500', label: 'Chat' },
    { component: <Video />, color: 'text-red-500', label: 'Meetings' },
    { component: <Users />, color: 'text-amber-500', label: 'Teams' }
  ];

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setLoadingComplete(true);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Cycle through loading messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      const currentIndex = loadingMessages.indexOf(loadingText);
      const nextIndex = (currentIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[nextIndex]);
    }, 2800);
    
    return () => {
      clearInterval(messageInterval);
    };
  }, [loadingText]);
  
  // Cycle through icons
  useEffect(() => {
    if (!loadingComplete) {
      const iconInterval = setInterval(() => {
        setActiveIcon(prev => (prev + 1) % icons.length);
      }, 1400);
      
      return () => {
        clearInterval(iconInterval);
      };
    }
  }, [loadingComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 overflow-hidden">
      {/* Animated hexagon pattern background */}
      <div className="fixed inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(5)">
              <polygon points="24.8,22 37.3,29.2 37.3,43.5 24.8,50.7 12.3,43.5 12.3,29.2" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500 dark:text-blue-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>
      
      {/* Glowing orb background */}
      <div 
        className="fixed inset-0 opacity-20 dark:opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0) 70%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0) 70%)'
        }}
      />

      {/* Logo and Name */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center p-4 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%)',
                animation: 'rotate 8s linear infinite'
              }}
            />
            
            <div className="relative w-16 h-16 flex items-center justify-center">
              {icons.map((icon, index) => (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ease-in-out transform ${
                    index === activeIcon 
                      ? 'scale-100 opacity-100' 
                      : 'scale-0 opacity-0'
                  } ${icon.color}`}
                  style={{ filter: index === activeIcon ? 'drop-shadow(0 0 8px currentColor)' : 'none' }}
                >
                  {React.cloneElement(icon.component, { size: 36, strokeWidth: 1.5 })}
                </div>
              ))}
            </div>
          </div>
          
          {loadingComplete && (
            <div className="absolute -right-1 -bottom-1 bg-green-500 text-white rounded-full p-1 shadow-lg scale-in">
              <CheckCircle size={20} />
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          CollabHub
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
          <Zap size={12} className="text-yellow-500" />
          <span>Sync · Create · Collaborate</span>
        </div>
      </div>
      
      {/* Feature icons */}
      <div className="flex justify-center gap-8 mb-10 max-w-md w-full">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div 
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 ${
                index === activeIcon ? 'bg-white dark:bg-gray-800 shadow-md scale-110' : 'bg-gray-100 dark:bg-gray-800/50'
              }`}
            >
              <div className={`${icon.color} ${index === activeIcon ? 'opacity-100' : 'opacity-50'}`}>
                {React.cloneElement(icon.component, { size: 20 })}
              </div>
            </div>
            <span className={`text-xs ${
              index === activeIcon 
                ? `${icon.color} font-medium` 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {icon.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Loading bar */}
      <div className="w-full max-w-md mb-6 px-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Loading your workspace</span>
          <span>{progress}%</span>
        </div>
        <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700/50 overflow-hidden backdrop-blur-sm">
          <div 
            className={`absolute h-full rounded-full transition-all duration-300 ease-out ${
              loadingComplete 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500'
            }`}
            style={{ 
              width: `${progress}%`,
              boxShadow: loadingComplete ? '0 0 12px rgba(34, 197, 94, 0.5)' : '0 0 12px rgba(99, 102, 241, 0.5)'
            }}
          />
          
          {/* Animated loading shine effect */}
          <div 
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            style={{ 
              animation: loadingComplete ? 'none' : 'shimmer 1.5s infinite',
              left: '-100%'
            }}
          />
        </div>
      </div>
      
      {/* Loading text */}
      <div className={`text-center transition-opacity duration-300 ${loadingComplete ? 'opacity-0' : 'opacity-100'}`}>
        <p className="min-h-6 text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center gap-2">
          <span className="relative w-4 h-4 inline-flex">
            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
            <span className="relative rounded-full w-4 h-4 bg-blue-500"></span>
          </span>
          {loadingText}...
        </p>
      </div>
      
      {/* "Ready" text that appears when loading is complete */}
      <div className={`text-center transition-all duration-700 transform ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
          <CheckCircle size={16} />
          Workspace ready
        </p>
      </div>
      
      {/* Footer with GitHub connection */}
      <div className="absolute bottom-6 flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
        <Github size={14} />
        <span>Connected to GitHub</span>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes shimmer {
          100% { left: 100%; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
'use client'; // This is a client component
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, Moon, Sun, Folder, FileQuestion, Wifi, WifiOff } from 'lucide-react';
import '../Styles/NotFound.css'; // Import your CSS file for custom styles

const NotFound = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    // Animation states
    const [animateNumber, setAnimateNumber] = useState(false);
    const [animateText, setAnimateText] = useState(false);
    const [animateFigures, setAnimateFigures] = useState(false);
    const [floatingElements, setFloatingElements] = useState([]);
    const [showConnectivityAnimation, setShowConnectivityAnimation] = useState(false);
    
    // Toggle search box
    const toggleSearchBox = () => {
        setShowSearchBox(!showSearchBox);
        setSearchText('');
    };
    
    // Handle mock search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            // In a real app, this would navigate or search
            setSearchText('');
            setShowSearchBox(false);
        }
    };
    
    // Generate floating elements for background animation
    useEffect(() => {
        const elements = [];
        const icons = [Folder, FileQuestion];
        
        for (let i = 0; i < 8; i++) {
            const IconComponent = icons[Math.floor(Math.random() * icons.length)];
            const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
            const left = Math.floor(Math.random() * 90) + 5; // 5% to 95%
            const animationDuration = Math.floor(Math.random() * 8) + 15; // 15s to 23s
            const delay = Math.floor(Math.random() * 10);
            
            elements.push({
                id: i,
                icon: IconComponent,
                size,
                left: `${left}%`,
                animationDuration: `${animationDuration}s`,
                delay: `${delay}s`,
                opacity: Math.random() * 0.3 + 0.1 // 0.1 to 0.4
            });
        }
        
        setFloatingElements(elements);
    }, []);

    // Trigger animations after initial load
    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
            
            // Start animations in sequence
            setTimeout(() => setAnimateNumber(true), 300);
            setTimeout(() => setAnimateText(true), 800);
            setTimeout(() => setAnimateFigures(true), 1200);
            
            // Start connectivity animation after a delay
            setTimeout(() => setShowConnectivityAnimation(true), 2000);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    // Base classes for the main container
    const baseClasses = "bg-white dark:bg-gray-900 text-gray-800 dark:text-white";
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-8 w-64 mt-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-48 mt-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden ${baseClasses}`}>
            {/* Floating background elements */}
            {floatingElements.map((el) => (
                <div 
                    key={el.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: el.left,
                        bottom: '-5%',
                        opacity: animateFigures ? el.opacity : 0,
                        transition: 'opacity 2s ease-out',
                        animation: animateFigures ? `float ${el.animationDuration} ease-in-out infinite alternate` : 'none',
                        animationDelay: el.delay
                    }}
                >
                    <el.icon size={el.size} className="text-gray-200 dark:text-gray-700" />
                </div>
            ))}
            
            {/* 404 number animation */}
            <div className="relative">
                <h1 
                    className={`text-9xl font-extrabold tracking-tight ${
                        animateNumber ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    } transition-all duration-700 ease-out`}
                >
                    <span 
                        className="inline-block text-purple-600 dark:text-purple-400 relative"
                        style={{
                            animation: animateNumber ? 'bounce 2s infinite 1s' : 'none'
                        }}
                    >
                        4
                        <span className="absolute -top-4 -right-2 text-2xl animate-[pulse_3s_ease-in-out_infinite]">
                            !
                        </span>
                    </span>
                    <span 
                        className="inline-block text-blue-600 dark:text-blue-400 relative mx-2"
                        style={{
                            animation: animateNumber ? 'float-subtle 3s infinite 1.5s' : 'none',
                            transformOrigin: 'center'
                        }}
                    >
                        0
                        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-100/80 dark:bg-blue-900/20 -z-10 animate-[pulse_4s_ease-in-out_infinite]"></span>
                    </span>
                    <span 
                        className="inline-block text-purple-600 dark:text-purple-400 relative"
                        style={{
                            animation: animateNumber ? 'bounce 2s infinite 2s' : 'none'
                        }}
                    >
                        4
                        <span className="absolute -top-4 -right-2 text-2xl animate-[pulse_3s_ease-in-out_infinite_0.5s]">
                            !
                        </span>
                    </span>
                </h1>
                
                {/* Animated decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className={`absolute bg-purple-200 dark:bg-purple-500 opacity-20 rounded-full w-32 h-32 -top-16 -left-16 blur-xl transform -translate-x-full ${animateNumber ? 'translate-x-0' : ''} transition-transform duration-1000 ease-out`}></div>
                    <div className={`absolute bg-blue-200 dark:bg-blue-500 opacity-20 rounded-full w-40 h-40 -bottom-20 -right-20 blur-xl transform translate-x-full ${animateNumber ? 'translate-x-0' : ''} transition-transform duration-1000 ease-out`}></div>
                    
                    {/* Additional decorative circles */}
                    <div className={`absolute rounded-full w-12 h-12 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-purple-300 dark:bg-purple-600 opacity-20 blur-md ${
                        animateNumber ? 'animate-[float-subtle_8s_ease-in-out_infinite]' : ''
                    }`}></div>
                    <div className={`absolute rounded-full w-6 h-6 bottom-0 left-1/4 transform -translate-y-full bg-blue-300 dark:bg-blue-600 opacity-20 blur-md ${
                        animateNumber ? 'animate-[float-subtle_6s_ease-in-out_infinite_1s]' : ''
                    }`}></div>
                    <div className={`absolute rounded-full w-8 h-8 bottom-0 right-1/4 transform -translate-y-full bg-purple-300 dark:bg-purple-600 opacity-20 blur-md ${
                        animateNumber ? 'animate-[float-subtle_7s_ease-in-out_infinite_0.5s]' : ''
                    }`}></div>
                </div>
            </div>
            
            {/* Message animation */}
            <div 
                className={`mt-6 mb-8 text-center ${
                    animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } transition-all duration-700 ease-out delay-300`}
            >
                <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
                <p className="max-w-md text-gray-600 dark:text-gray-300">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved to another location.
                </p>
                
                {/* Animated underline */}
                <div className="relative h-1 w-32 mx-auto mt-4">
                    <div 
                        className={`absolute top-0 left-0 h-full bg-blue-400 dark:bg-blue-500 rounded transform scale-x-0 origin-left ${
                            animateText ? 'animate-[grow_1.5s_ease-out_forwards]' : ''
                        }`}
                        style={{width: '100%'}}
                    ></div>
                </div>
            </div>
            
            {/* Actions */}
            <div 
                className={`flex flex-col sm:flex-row items-center gap-4 ${
                    animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } transition-all duration-700 ease-out delay-500`}
            >
                <Link 
                    href="/" 
                    className="flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                >
                    <Home size={18} className="mr-2" />
                    Go Home
                </Link>
                
                <button 
                    onClick={toggleSearchBox} 
                    className="flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                    <Search size={18} className="mr-2" />
                    Search
                </button>
                
                <button 
                    onClick={() => window.history.back()} 
                    className="flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Go Back
                </button>
            </div>
            
            {/* Search box animation */}
            <div 
                className={`mt-8 w-full max-w-md transition-all duration-500 ${
                    showSearchBox ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search for content..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-colors duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 text-gray-800 dark:text-white shadow-md"
                    />
                    <button 
                        type="submit" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Search size={18} className="text-gray-500 dark:text-gray-300" />
                    </button>
                </form>
            </div>
            
            {/* Footer */}
            <div 
                className={`absolute bottom-4 text-sm text-gray-500 dark:text-gray-400 ${animateText ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-700`}
            >
                © {new Date().getFullYear()} CollabHub. All rights reserved.
            </div>
        </div>
    );
};

export default NotFound;

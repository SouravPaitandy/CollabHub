import React from 'react';
import { useTheme } from 'next-themes';

const Loader = () => {
  const { resolvedTheme } = useTheme();

  const isDarkTheme = resolvedTheme === 'dark';

  return (
    <div className={`loader-container ${isDarkTheme ? 'dark' : ''}`}>
      <div className="infinity-loader"></div>
      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
          transition: background-color 0.3s ease;
        }

        .loader-container.dark {
          background-color: #1a202c;
        }

        .infinity-loader {
          width: 120px;
          height: 60px;
          position: relative;
        }

        .infinity-loader::before,
        .infinity-loader::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          border: 8px solid #3498db;
          border-radius: 50px 50px 0 50px;
          transform: rotate(-45deg);
          animation: rotate 2s cubic-bezier(0.55, 0.3, 0.24, 0.99) infinite;
        }

        .loader-container.dark .infinity-loader::before,
        .loader-container.dark .infinity-loader::after {
          border-color: #60a5fa;
        }

        .infinity-loader::after {
          left: auto;
          right: 0;
          border-radius: 50px 50px 50px 0;
          transform: rotate(-45deg);
        }

        @keyframes rotate {
          0% {
            transform: rotate(-45deg);
          }
          50% {
            transform: rotate(135deg);
          }
          100% {
            transform: rotate(315deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
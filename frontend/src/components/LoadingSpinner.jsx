import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const LoadingSpinner = ({ message }) => {
  const { backendAwake } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg">
          {!backendAwake 
            ? "Connecting to server. This may take a few moments..." 
            : message || "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 
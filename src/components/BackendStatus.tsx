import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '@/lib/api-service';
import { AlertCircle, CheckCircle } from 'lucide-react';

const BackendStatus: React.FC = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      setIsChecking(true);
      try {
        const isAvailable = await checkBackendHealth();
        setIsBackendAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking backend health:', error);
        setIsBackendAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
    
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isChecking && isBackendAvailable === null) {
    return (
      <div className="flex items-center text-xs text-gray-500">
        <span className="animate-pulse mr-1">●</span>
        <span>Checking backend...</span>
      </div>
    );
  }

  if (isBackendAvailable) {
    return (
      <div className="flex items-center text-xs text-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        <span>Backend connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs text-red-500">
      <AlertCircle className="h-3 w-3 mr-1" />
      <span>Backend unavailable</span>
    </div>
  );
};

export default BackendStatus; 
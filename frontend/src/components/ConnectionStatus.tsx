import React, { useEffect, useState } from 'react';
import { testAPIConnection, ConnectionStatus } from '../utils/apiTest';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

const ConnectionStatusComponent: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      const connectionStatus = await testAPIConnection();
      setStatus(connectionStatus);
      setIsLoading(false);
    };

    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        Checking connection...
      </div>
    );
  }

  if (!status) {
    return null;
  }

  if (status.isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
        <Wifi className="w-4 h-4" />
        {status.message}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
      <WifiOff className="w-4 h-4" />
      {status.message}
    </div>
  );
};

export default ConnectionStatusComponent;

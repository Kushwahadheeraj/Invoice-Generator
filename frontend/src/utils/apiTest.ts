import api from '../services/api';

export interface ConnectionStatus {
  isConnected: boolean;
  message: string;
  timestamp: Date;
}

export const testAPIConnection = async (): Promise<ConnectionStatus> => {
  try {
    // Test basic connectivity - use a valid endpoint
    const response = await api.get('/invoices');
    
    if (response.status === 200 || response.status === 401) {
      return {
        isConnected: true,
        message: 'Backend connection successful',
        timestamp: new Date(),
      };
    }
    
    return {
      isConnected: false,
      message: `Unexpected response: ${response.status}`,
      timestamp: new Date(),
    };
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return {
        isConnected: false,
        message: 'Backend server is not running. Please start the backend server.',
        timestamp: new Date(),
      };
    }
    
    if (error.response?.status === 404) {
      return {
        isConnected: true,
        message: 'Backend is running but endpoint not found (this is normal)',
        timestamp: new Date(),
      };
    }
    
    return {
      isConnected: false,
      message: `Connection error: ${error.message}`,
      timestamp: new Date(),
    };
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await api.get('/invoices');
    return true;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running');
      return false;
    }
    return true; // Other errors might mean server is running but endpoint doesn't exist
  }
};

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://invoice-generator-2-0mdk.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || 'https://invoice-generator-2-0mdk.onrender.com/api',
};

// Export individual values for backward compatibility
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://invoice-generator-2-0mdk.onrender.com/api';

// App Configuration
export const APP_CONFIG = {
  name: 'Invoice Generator',
  version: '1.0.0',
};

// Feature Flags
export const FEATURES_CONFIG = {
  pdfGeneration: true,
  invoiceTemplates: true,
  bulkOperations: false,
};

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  pdf: {
    generate: '/pdf/generate',
  },
  invoices: {
    create: '/invoices',
    list: '/invoices',
    get: (id: string) => `/invoices/${id}`,
    update: (id: string) => `/invoices/${id}`,
    delete: (id: string) => `/invoices/${id}`,
  },
};

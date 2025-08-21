// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    name: 'Invoice Generator',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    pdfGeneration: true,
    invoiceTemplates: true,
    bulkOperations: false,
  },
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  invoices: {
    list: '/invoices',
    create: '/invoices',
    update: (id: string) => `/invoices/${id}`,
    delete: (id: string) => `/invoices/${id}`,
    getById: (id: string) => `/invoices/${id}`,
  },
  pdf: {
    generate: '/pdf/generate',
    download: '/pdf/download',
  },
};

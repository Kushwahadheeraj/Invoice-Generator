# Backend to Frontend Connection Setup

This guide explains how to connect the backend and frontend of the Invoice Generator application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   # Create .env file in backend directory
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5001`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   # Create .env file in frontend directory
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_APP_NAME=Invoice Generator
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Connection Features

### ✅ Implemented
- **Authentication Service**: Login, register, and token management
- **Invoice Service**: CRUD operations for invoices
- **PDF Service**: PDF generation and download
- **Centralized API Configuration**: Single point for API settings
- **Error Handling**: Proper error handling and user feedback
- **Token Management**: Automatic token inclusion in requests
- **Unauthorized Handling**: Automatic logout on 401 responses

### 🔧 API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Invoices
- `GET /api/invoices` - Get all invoices (with optional filters)
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id` - Get invoice by ID

#### PDF Generation
- `POST /api/pdf/generate` - Generate PDF from invoice

## Testing the Connection

1. **Start both servers** (backend and frontend)
2. **Open the frontend** in your browser
3. **Register a new user** or login with existing credentials
4. **Create an invoice** to test the full flow
5. **Generate a PDF** to verify PDF service connection

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend has CORS enabled (already configured)
2. **Connection Refused**: Check if backend is running on port 5001
3. **MongoDB Connection**: Verify MongoDB connection string in backend .env
4. **Port Conflicts**: Change ports in .env files if needed

### Debug Mode

Enable debug logging by setting environment variables:
```bash
# Backend
DEBUG=app:*

# Frontend
VITE_DEBUG=true
```

## Production Deployment

For production, update the environment variables:
```bash
# Frontend
VITE_API_BASE_URL=https://your-production-api.com/api

# Backend
NODE_ENV=production
PORT=3000
```

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- API endpoints are protected with authentication middleware
- CORS is configured for development (restrict in production)
- Input validation is implemented on both frontend and backend

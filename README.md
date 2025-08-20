# MERN Stack PDF Generator

A full-stack PDF generation application built with the MERN stack and Puppeteer for backend PDF generation.

## 🚀 Technologies Used

### Backend (Mandatory)
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Puppeteer** - PDF generation from HTML
- **TypeScript** - Type safety

### Frontend (Mandatory)
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-stack-pdf-generator
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   This will install dependencies for:
   - Root project
   - Backend server
   - Frontend client

## 🚀 Running the Application

### Development Mode (Recommended)

Run both backend and frontend simultaneously:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

### Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### Production Build

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
mern-stack-pdf-generator/
├── backend/                 # Node.js + Express server
│   ├── src/
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── package.json             # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Backend API

- **POST** `/api/generate-pdf` - Generate PDF from HTML content
- **GET** `/api/health` - Health check endpoint

### PDF Generation Request

```json
{
  "html": "<!DOCTYPE html><html>...</html>",
  "options": {
    "format": "A4",
    "printBackground": true,
    "margin": {
      "top": "20px",
      "right": "20px",
      "bottom": "20px",
      "left": "20px"
    }
  }
}
```

## 🎨 Features

- **HTML Editor**: Rich text editor for HTML content
- **Live Preview**: Real-time preview of HTML content
- **PDF Options**: Customizable page format, margins, and background printing
- **Sample Templates**: Pre-built HTML templates to get started
- **Responsive Design**: Modern UI that works on all devices
- **Error Handling**: Comprehensive error handling and user feedback
- **State Management**: Redux for global state management
- **API Integration**: TanStack Query for efficient data fetching

## 🚫 Important Notes

⚠️ **Disqualification Criteria:**
- Using HTML, Bootstrap CSS, Angular, or JavaScript instead of the specified stack
- PDF generation from frontend (must use backend with Puppeteer)

✅ **Compliant Technologies:**
- React (Frontend)
- Puppeteer (Backend PDF generation)
- Redux (State Management)
- NodeJS (Backend)
- ViteJS (Build tool)
- TypeScript
- TanStack Query
- Tailwind CSS

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Puppeteer installation**: On some systems, Puppeteer may require additional dependencies
3. **TypeScript errors**: Run `npm run build` in both backend and frontend to check for type errors

### Development Tips

- Use the "Load Sample" button to quickly test with sample HTML
- Check the browser console and terminal for error messages
- The preview feature helps verify HTML before PDF generation

## 📝 License

MIT License - feel free to use this project for your assignments and projects.

## 🤝 Contributing

This project is designed for educational purposes and follows the MERN stack assignment requirements. Contributions are welcome!

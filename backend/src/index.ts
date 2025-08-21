// server/src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import pdfRoutes from './routes/pdf.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://kushwahadheeraj245:Dkushwaha@cluster0.l2zvycp.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch(err => console.error('Could not connect to MongoDB', err));
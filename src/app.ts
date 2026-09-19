import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { getDatabase } from './config/database';
import { StudentModel } from './models/studentModel';
import { StudentController } from './controllers/studentController';
import { getStudentRoutes } from './routes/studentRoutes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (dbPath?: string) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // Setup DB and dependencies
  const db = getDatabase(dbPath);
  const studentModel = new StudentModel(db);
  const studentController = new StudentController(studentModel);
  const studentRoutes = getStudentRoutes(studentController);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // API Routes
  app.use('/api/students', studentRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
};
